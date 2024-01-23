//importazione di tutti cio di cui ho bisogno per questo component
import { useEffect, useState } from "react";
import { Card, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

/*component che, attraverso l'endpoint fornito e i dati che gli vengono mandati dallo stato del search, recupara i dati relativi alle previsioni dei prossimi 5 giorni (ognuno dei quali diviso in fasce orarie ogni 3 ore).                         i dati ricevuti verranno utilizzati per popolare la pagina
 */

const Forecast = () => {
  //questa costante mi serve per recuperare il dato inserito dall'utente, attraverso il cambiamento di stato riportato dalla relativa funzione search di rootReducer che si riferisce alla funzione searchReducer
  const search = useSelector((state) => state.search);

  //questo verrà riempito con i dati provenienti dall'API
  const [citta, setCitta] = useState(null);

  // GET che recupera i dati dall'API e li inserisce nella costante sopradichiarata (citta), e relativi controlli con eventuale segnalazione di errori qualora i dati non arrivino correttamente
  const fetchData = async () => {
    try {
      const res = await fetch(
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
          search +
          "&units=metric&APPID=a03f37e66ba4c3bdae78d5759287aef7"
      );
      if (res.ok) {
        let data = await res.json();
        console.log(data);
        setCitta(data);
      } else {
        console.log("error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //funzione che triggera la funzione precedente solo se la barra di ricerca non è null e contiene più di 2 caratteri
  useEffect(() => {
    if (search?.length > 2) fetchData();
  }, [search]);

  //dal momento che l'API restituisce le previsioni con intervallo di 3 ore per ogni giorno, con questa funzione recupero i dati corrispondenti a 5 fasce orarie per ogni giorno, per un totale di 5 giorni a partire da domani
  const dayByDay = () => {
    const groupedData = {};

    citta.list.forEach((forecast) => {
      const date = new Date(forecast.dt * 1000);
      const day = date.toLocaleDateString();
      if (!groupedData[day]) {
        groupedData[day] = [];
      }
      groupedData[day].push(forecast);
    });
    return Object.keys(groupedData)
      .slice(1, 5)
      .map((day) => ({
        day,
        forecasts: groupedData[day],
      }));
  };

  //creazione dell'HTML corrispondente ai dati sopraelencati
  return (
    <>
      {citta && citta.list && (
        <div>
          <h2>{citta?.city.name}</h2>
          <Container>
          {dayByDay().map((dayData, index) => (
            <div key={index}>
              <Row>
              <h3>{dayData.day}</h3>
              </Row>
              {dayData.forecasts.map((cit, i) => (
                <div key={i}>
                  <div className="descrizione">
                    <p>{new Date(cit.dt * 1000).toLocaleTimeString()}</p>
                    <h4>{cit.weather[0].main}</h4>
                    <p>{cit.weather[0].description}</p>
                  </div>
                  <div className="cardDiv gap-2">
                    <div className="spazi">
                      <Card style={{ width: "18rem" }} className="carine">
                        <Card.Body>
                          <Card.Title>Wind Speed</Card.Title>
                          <Card.Text>{cit.wind.speed} km/h</Card.Text>
                        </Card.Body>
                      </Card>
                      <Card style={{ width: "18rem" }} className="carine">
                        <Card.Body>
                          <Card.Title>Humidity</Card.Title>
                          <Card.Text>{cit.main.humidity}%</Card.Text>
                        </Card.Body>
                      </Card>
                    </div>
                    <div className="spazi">
                      <Card style={{ width: "18rem" }} className="carine">
                        <Card.Body>
                          <Card.Title>Temp. Max</Card.Title>
                          <Card.Text>{cit.main.temp_max}°c</Card.Text>
                        </Card.Body>
                      </Card>
                      <Card style={{ width: "18rem" }} className="carine">
                        <Card.Body>
                          <Card.Title>Temp. Min</Card.Title>
                          <Card.Text>{cit.main.temp_min}°c</Card.Text>
                        </Card.Body>
                      </Card>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
          </ Container>
          <div className="centro">
            <Link className="text-white" to="/">
              Vai alla previsioni di oggi
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Forecast;
