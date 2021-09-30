import logo from './logo.svg';
import './App.css';
import 'semantic-ui-css/semantic.min.css'
import { ReactBingmaps } from 'react-bingmaps';
import { useEffect, useState } from 'react'
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
const BING_KEY = "AtUaVBNRoIbJ8rItc_38XjYh1__ZvxjRtu0Ukk2giW_p86BS5k3svWtjfjzQ6K6J";

const styles = {
  main: {
    container: {
      border: '1px solid black',
      width: '100%',
      float: 'left',
      height: '70vh',
      padding: '10px',
      margin: '5px'
    },
    formContainer: { display: 'flex', justifyContent: 'center', flexDirection: 'row', paddingTop: '20px' }
  },
  form: {
    container: {},
    error: { color: 'red' }
  },

}
const validateLatLng = (value) => {
  let regex = new RegExp(/^([-+]?)([\d]{1,2})(((\.)(\d+)(,)))(\s*)(([-+]?)([\d]{1,3})((\.)(\d+))?)$/);
  return regex.test(value);
}

const App = () => {
  const [address, setAddress] = useState("");
  const [centerMap, setCenterMap] = useState([]);
  const [coordinates, setCoordinates] = useState({
    lat: "",
    lng: ""
  });
  const [pins, setPins] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (pins.length) { setCenterMap(pins[pins.length - 1].location) }
  }, [pins]);


  const handelSubmit = (e) => {
    e.preventDefault();
    // if (!validateLatLng(`${coordinates.lng},${coordinates.lat}`)) {
    //   setError('values is incorrect, try again plz...')
    // } else {
    setError('')
    setPins([...pins, { "location": [coordinates.lat, coordinates.lng], "option": { color: 'red' } }])
    setCoordinates({ lat: "", lng: "" })
    // }
  }

  return (
    <div style={styles.main.container}>
      <ReactBingmaps
        polyline={{
          "location": pins.map(pin => pin.location),
          "option": { strokeColor: 'blue', strokeThickness: 5 }
        }}
        pushPins={pins}
        bingmapKey={BING_KEY}
        center={centerMap}
      >
      </ReactBingmaps>
      <h3 style={{ textAlign: 'center' }}>Search by Text/Coordinates Values</h3>
      <div style={styles.main.formContainer}>
        <SearchForm
          address={address}
          setAddress={setAddress}
          setCoordinates={setCoordinates}
        />
        <CoordinatesForm
          coordinates={coordinates}
          handelSubmit={handelSubmit}
          setCoordinates={setCoordinates}
          error={error} />
      </div>

    </div >
  );

}

export default App;

const SearchForm = ({
  address,
  setAddress,
  setCoordinates
}) => {

  const handleSelect = async value => {
    try {
      const results = await geocodeByAddress(value);
      const latLng = await getLatLng(results[0]);
      setCoordinates(latLng);
      setAddress('');

    } catch (error) {
      console.log(error);
    }

  };

  return (
    <PlacesAutocomplete
      value={address}
      onChange={setAddress}
      onSelect={handleSelect}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div>

          <input {...getInputProps({ placeholder: "Type address" })} />

          <div>
            {loading ? <div>...loading</div> : null}

            {suggestions.map((suggestion, i) => {
              const style = {
                backgroundColor: suggestion.active ? "#41b6e6" : "#fff"
              };
              return (
                <div key={i.toString()} {...getSuggestionItemProps(suggestion, { style })}>
                  {suggestion.description}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  )
}

const CoordinatesForm = ({
  handelSubmit,
  coordinates,
  setCoordinates,
  error }) => {

  const handleChange = (value) => {
    setCoordinates({ ...coordinates, ...value })
  }

  return (
    <form
      style={styles.form.container}
      onSubmit={handelSubmit}>
      <input
        value={coordinates.lng}
        onChange={(e) => handleChange({ lng: Number(e.target.value) })}
        type="number"
        placeholder="longitude"
        name="longitude" />
      <input
        value={coordinates.lat}
        onChange={(e) => handleChange({ lat: Number(e.target.value) })}
        type="number"
        placeholder="latitude"
        name="latitude" />

      <input type="submit" />
      {error && <p style={styles.form.error} >{error}</p>}
    </form>
  )


}
