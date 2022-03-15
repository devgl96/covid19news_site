// URL from API Covid19 Brazil
const URL_API_BRASIL = "https://covid19-brazil-api.vercel.app/api/report/v1";
const URL_API_NEWS = "https://newsdata.io/api/1/news?apikey=pub_54728ec82f44dfd171596a494a49e5bdcd6d&q=covid ";


// console.log("GetInformation: ", getInformation);

// setInterval(() => {
// }, 1000 * 10);

async function main() {
    async function getInformationByAPI(url) {
        const response = await fetch(url);
        const dataFromAPI = await response.json();
        const dataOnly = (dataFromAPI.data !== undefined ? dataFromAPI.data : dataFromAPI.results);

        return dataOnly;
    }

    // Get info from API
    const dataInfo = await getInformationByAPI(URL_API_BRASIL);

    // Get section from HTML to show the result
    const sectionHTMLInformation = document.getElementById("currentInformation");

    console.log("dataInfo: ", dataInfo);

    // Creating a structure to show information in webpage
    const structuringDataAboutCovid = dataInfo.map(info => (
        `
        <tr>
            <td>${info.state}</td>
            <td>${info.cases}</td>
            <td>${info.deaths}</td>
            <td>${info.suspects}</td>
        </tr>
        `
    ));

    // Variable to use in setInterval and managing the loop
    let amountInfoNumber = 0;

    sectionHTMLInformation.innerHTML += `${structuringDataAboutCovid[amountInfoNumber]}`;

    const getNews = await getInformationByAPI(URL_API_NEWS);

    console.log("GetNews: ", getNews);

    const filterNewsOnlyWithImages = getNews.filter(news => news.image_url !== null);

    let infoNewsHTML = document.querySelector(".allNews");

    console.log("filterNews: ", filterNewsOnlyWithImages);
    
    filterNewsOnlyWithImages.forEach((news) => (
        infoNewsHTML.innerHTML += `<div class="infoNews">
            <img src=${news.image_url} alt=${news.title.split(" ").slice(0, 5).join(" ")}/>
            <h4>${news.title}</h4>
            <p>${news.description}</p>
        </div>`
    ));

    // =============

    function changeData() {
        setTimeout(() => {
            if(amountInfoNumber < structuringDataAboutCovid.length - 1) {
                // console.log("I'm here => amount: ", amountInfoNumber);
                amountInfoNumber++;
    
                // Get all the tbody elements
                let tbodyElements = document.getElementsByTagName("tbody");
    
                if(tbodyElements) {
                    sectionHTMLInformation.removeChild(tbodyElements[tbodyElements.length - 1]);
                    sectionHTMLInformation.innerHTML += `${structuringDataAboutCovid[amountInfoNumber]}`;
                    changeData();
                }
            } else {
                amountInfoNumber = 0;
                changeData();
            }
        }, 1000 * 1);
    }

    changeData();
}

main();