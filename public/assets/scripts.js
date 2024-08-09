const modalFeedback = new bootstrap.Modal(document.getElementById('modal-feedback'), {})

let langData = {}
let data = []

const updateContent = (langData) => {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n')
        if (key in langData)
            element.innerHTML = langData[key]
        else
            console.log(`Could not find ${key}`)
    });
}

const setLanguagePreference = (lang) => {
    localStorage.setItem('language', lang)
}

const changeLanguage = async (lang) => {
    const response = await fetch(`assets/languages/${lang}.json`);
    langData = JSON.parse(await response.text())
    updateContent(langData)
    setLanguagePreference(lang)
}

document.getElementById('lang').addEventListener('change', (e) => {
    changeLanguage(e.target.value)
})

const saveForm = (formData) => {
    let formDataObj = {}
    formData.forEach((value, key) => (formDataObj[key] = value))

    formDataObj['timestamp'] = Date.now()

    // include new data
    console.log(data)
    data.push(formDataObj)
    localStorage.setItem('src-data', JSON.stringify(data))
}

document.getElementById('submit').addEventListener('click', (e) => {
    let formData = new FormData(document.getElementById('form'))
    saveForm(formData)

    // handle modal
    let radio1 = document.querySelector('input[name="radio-1"]:checked')
    if (radio1) {
        document.getElementById('feedback-title').innerHTML = langData[`feedback_title_${radio1.value}`]
        document.getElementById('feedback-body').innerHTML = langData[`feedback_${radio1.value}`]
    }
    modalFeedback.show()
    document.getElementById('form').reset()
})

const changeTab = (target) => {
    document.querySelectorAll('.tab-link').forEach(link => {
        if (link.href.includes(target))
            link.classList.add('active')
        else
            link.classList.remove('active')
    })

    document.querySelectorAll('.src-tab').forEach(tab => {
        if (tab.id == target) {
            tab.style.display = "block"
        } else {
            tab.style.display = "none"
        }
    })

    generateDataRows()
    updateChart(dataToGraph())
}

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault()
        changeTab(e.target.getAttribute('href').replace('#', ''))
        dataToGraph()
    })
})

document.getElementById('modal-report').addEventListener('click', e => {
    changeTab('report')
})

// PDF export
const generatePdfTable = () => {
    output = [['Timestamp', 'topic', 'description', 'level']]
    data.forEach((item, i) => {
        output.push([
            new Date(item['timestamp']).toLocaleString(),
            item['topic'],
            item['description'],
            langData['level_'+item['radio-1']]
        ])
    })
    return output
}

document.getElementById('download-pdf').addEventListener('click', e => {
    e.preventDefault()
    const dataURL = chart.dataURI({ width: 2560 }).then(({ imgURI, blob }) => {
        var dd = {
            content: [
                {text: 'Report', style: 'header'},
                {image: imgURI, width: 500},
                {table: {
                    body: generatePdfTable()
                }}
            ],
            defaultStyle: {
            }
        };
        pdfMake.createPdf(dd).download();
    })

})

// Handle deleting data
document.addEventListener('click', e => {
    if (e.target.classList.contains('del-row')) {
        let i = parseInt(e.target.getAttribute('data-i'))
        if (i == -1) {
            data = []
        } else {
            data.splice(i, 1)
        }
        localStorage.setItem('src-data', JSON.stringify(data))
        generateDataRows()
        updateChart(dataToGraph())
    }
})

// return data selections for grap
const dataToGraph = () => {
    return data.map(x => ['','a','b','c','d','e'].indexOf(x['radio-1']))
}

const generateDataRows = () => {
    // TÄHÄN PITÄÄ LISÄTÄ LOKALISOINTI
    let rows = '<table class="table"><tr><th>Timestamp</th><th>topic</th><th>description</th><th>level</th><th class="del-row" data-i="-1">Delete All</th></tr>'
    data.forEach((item, i) => {
        rows += `<tr><td>${new Date(item['timestamp']).toLocaleString()}</td><td>${item['topic']}</td><td>${item['description']}</td><td>${langData['level_'+item['radio-1']]}</td><td><span class="del-row" data-i="${i}">&#x2715;</span></td></tr>`
    })
    document.getElementById('data-rows').innerHTML = rows
}

// Check language settings
if ('language' in localStorage) {
    let lang = localStorage.getItem('language')
    document.getElementById('lang').value = lang
    changeLanguage(lang)
} else {
    changeLanguage('en')
}

// Check previous data
if ('src-data' in localStorage) {
    try {
        let previousData = JSON.parse(localStorage.getItem('src-data'))
        if (Array.isArray(previousData))
            data = previousData
    } catch (error) {
        console.log(error)
    }
}

// CHART
var options = {
    series: [{
        name: "",
        data: []
    }],
    chart: {
        height: '100%',
        type: 'line',
        zoom: {
            enabled: false
        },
        toolbar: {show: false}
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'straight'
    },
    title: {
        text: '',
        align: 'left'
    },
    markers: {
        size: 5
    },
    yaxis: {
        min: 0,
        max: 5,
        tickAmount: 5,
        forceNiceScale: false,
        labels: {
            style: {
                //fontSize: '16px',
                fontFamily: 'Bootstrap-icons'
            },
            formatter: function(val, index) {
                tmp = {
                    0:'',
                    1: '\uF28A',
                    2: '\uF287',
                    3: '\uF5D3',
                    4: '\uF1B5',
                    5: '\uF2EE',
                }
                return tmp[val];
            }
        }
    },
    tooltip: {
        enabled: false
    }
}
 
var chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();

var yaxis_title = "";
var xaxis_title = "Task";

const updateChart = (data) => {
    // Tähän mahdollisesti ylläolevien muuttujien vaihto kieliversion mukaan
    chart.updateOptions({
        series: [{
            name: yaxis_title,
            data: dataToGraph()
        }],
        xaxis:{
            title:{text: "tehtävä"}
        },
    })
}
