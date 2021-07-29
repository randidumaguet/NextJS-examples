import axios from "axios";
import { useEffect, useState } from "react";

const RSSPage = () => {
  const [RSSData, setRSSData] = useState(null);

  useEffect(() => {
    if (!RSSData) {
      axios.get('https://www.canada.ca/en/news/web-feeds/covid-19.atom.xml')
        .then(data => {
          const parser = new DOMParser();
          const xmlDom = parser.parseFromString(data.data, "application/xml");
          if (xmlDom.documentElement.nodeName !== "parsererror") {
            setRSSData(xmlDom.getElementsByTagName('entry'));
          }
        })
        .catch(error => console.log(error));
    }
  }, [RSSData]);

  return (<>
    {
      RSSData ? 
      <div>
        <h1>COVID19 News from Canada Government</h1>
        <ul>
          {
            [...RSSData].map(entry => {
              let title   = entry.getElementsByTagName('title')[0].innerHTML;
              let href    = entry.getElementsByTagName('id')[0].innerHTML;
              let date    = new Date( entry.getElementsByTagName('updated')[0].innerHTML ).toDateString();
              let author  = entry.querySelector('author > name').innerHTML;
              let excerpt = entry.getElementsByTagName('summary')[0].innerHTML;

              return (
                <li key={ href+date }>
                  <h3>
                    <a href={ href }>{ title }</a>
                  </h3>
                  <p>
                    By: { author}
                    <br />
                    Last Updated: { date }
                  </p>
                  <p>{ excerpt }</p>
                </li>
              )
            })
          }
        </ul>
      </div>
      :
      <p>Loading...</p>
    }
  </>)
}

export default RSSPage;