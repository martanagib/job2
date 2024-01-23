//importazione di tutti cio di cui ho bisogno per questo component
import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

/*component che, attraverso l'endpoint fornito e i dati che gli vengono mandati dallo stato del search, recupara i dati relativi alle previsioni di oggi. i dati ricevuti verranno utilizzati per popolare la pagina
 */
const Results = () => {
  //questa costante mi serve per recuperare il dato inserito dall'utente, attraverso il cambiamento di stato riportato dalla relativa funzione search di rootReducer che si riferisce alla funzione searchReducer
  const search = useSelector((state) => state.search);

  //questo verrà riempito con i dati provenienti dall'API
  const [city, setCityData] = useState(null);

  // GET che recupera i dati dall'API e li inserisce nella costante sopradichiarata (citta), e relativi controlli con eventuale segnalazione di errori qualora i dati non arrivino correttamente
  const fetchData = async () => {
    try {
      const res = await fetch(
        "https://api.openweathermap.org/data/2.5/weather?q=" +
          search +
          "&units=metric&APPID=a03f37e66ba4c3bdae78d5759287aef7"
      );
      if (res.ok) {
        let data = await res.json();
        console.log(data);

        setCityData(data);
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

  //inizializzo una costante con la data fornita dall'API e la utilizzo per passere il dato ad un'altra costante che con l'utilizzo di Date e del metodo toLocaleString() la 'trasforma' nel formato convenzionale locale gg/mm/aaaa
  const day = city?.dt;
  const printDate = new Date(day * 1000).toLocaleString();

  //creazione dell'HTML corrispondente ai dati sopraelencati
  return (
    <>
      {city && (
        <div>
          <div>
            <p>{printDate}</p>
          </div>
          <div>
            <h2>{city.name}</h2>
          </div>
          <div className="descrizione">
            <h4>{city.weather[0]?.main}</h4>
            <p>{city.weather[0]?.description}</p>
          </div>
          <div className="cardDiv gap-2">
            <div className="spazi">
              <Card style={{ width: "18rem" }} className="carine">
                <Card.Body>
                  <Card.Title>Wind Speed</Card.Title>
                  <Card.Text>{city.wind.speed} km/h</Card.Text>
                </Card.Body>
              </Card>
              <Card style={{ width: "18rem" }} className="carine">
                <Card.Body>
                  <Card.Title>Humidity</Card.Title>
                  <Card.Text>{city.main.humidity}%</Card.Text>
                </Card.Body>
              </Card>
            </div>
            <div className="spazi">
              <Card style={{ width: "18rem" }} className="carine">
                <Card.Body>
                  <Card.Title>Temp. Max</Card.Title>
                  <Card.Text>{city.main.temp_max}°c</Card.Text>
                </Card.Body>
              </Card>
              <Card style={{ width: "18rem" }} className="carine">
                <Card.Body>
                  <Card.Title>Temp. Min</Card.Title>
                  <Card.Text>{city.main.temp_min}°c</Card.Text>
                </Card.Body>
              </Card>
            </div>
          </div>
          <div className="centro">
            <Link to="/Forecast" className="text-white">
              Vai alle previsioni dei prossimi giorni
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Results;
