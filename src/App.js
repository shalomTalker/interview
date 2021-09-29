import logo from './logo.svg';
import './App.css';
import { ReactBingmaps } from 'react-bingmaps';
import { useEffect, useState } from 'react'

const App = () => {
  const validateLatLng = (value) => {
    let regex = new RegExp(/^([-+]?)([\d]{1,2})(((\.)(\d+)))(\s*)(([-+]?)([\d]{1,3})((\.)(\d+))?)$/);
    console.log(regex.test(value));
    return regex.test(value);
  }
  const [pins, setPins] = useState([]);
  const [error, setError] = useState('');
  const [longitudeValue, setLongitude] = useState('')
  const [latitudeValue, setLatitude] = useState('')

  const handelSubmit = (e) => {
    e.preventDefault();
    if (!validateLatLng(longitudeValue) || !validateLatLng(latitudeValue)) {
      setError('values is incorrect, try again plz...')
    } else {
      setError('')
      console.log([...pins, { "location": [latitudeValue, longitudeValue], "option": { color: 'red' } }]);
      setPins([...pins, { "location": [latitudeValue, longitudeValue], "option": { color: 'red' } }])
      setLongitude('')
      setLatitude('')
    }
  }


  return (
    <div style={{
      border: '1px solid black',
      width: '100%',
      float: 'left',
      height: '500px',
      padding: '10px',
      margin: '5px'
    }}>
      <ReactBingmaps
        pushPins={pins}
        bingmapKey="AtUaVBNRoIbJ8rItc_38XjYh1__ZvxjRtu0Ukk2giW_p86BS5k3svWtjfjzQ6K6J"
        center={pins[0]?.location || []}
      >
      </ReactBingmaps>
      <form style={{ paddingTop: '20px' }} onSubmit={handelSubmit}>
        <h2>pick by coordinates</h2>
        <label
          htmlFor="longitude"
          style={{ flexDirection: 'column', display: 'flex', width: '50%' }}>longitude
          <input
            value={longitudeValue}
            onChange={(e) => setLongitude(Number(e.target.value))}
            type="number"
            placeholder="longitude"
            name="longitude" />
        </label>
        <label
          htmlFor="latitude"
          style={{ flexDirection: 'column', display: 'flex', width: '50%' }}>latitude
          <input
            value={latitudeValue}
            onChange={(e) => setLatitude(Number(e.target.value))}
            type="number"
            placeholder="latitude"
            name="latitude" />
        </label>

        <input type="submit" />
        {error && <p style={{ color: 'red' }} >{error}</p>}
      </form>
    </div>
  );
}

export default App;
