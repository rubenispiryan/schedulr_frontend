import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
 // State to store businesses from your Django API
 const [businesses, setBusinesses] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);

 // Fetch businesses on component mount (like Django's model data)
 useEffect(() => {
   const fetchBusinesses = async () => {
     try {
        const response = await axios.get('http://localhost:8000/businesses/');
        console.log(response.status);
        setBusinesses(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || "Error message not present");
        console.log(err.response.status);
      } finally {
        setLoading(false);
      }
   };
   fetchBusinesses();
 }, []);

 if (loading) return <div>Loading...</div>;
 if (error) return <div>Error: {error}</div>;

 return (
   <div>
     <h1>Businesses</h1>
     {businesses.map((business) => (
       <div key={business.id}>
         <h2>{business.name}</h2>
         <p>{business.address}</p>
       </div>
     ))}
   </div>
 );
}

export default App;