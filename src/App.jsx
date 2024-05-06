import React, { useEffect, useState } from 'react'
import './App.css'
import mqtt from 'mqtt'
import herisson from './assets/herisson.png'
import { AiOutlineClose } from 'react-icons/ai';

function App() {
  const [message, setMessage] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const host = "ws://broker.emqx.io:8083/mqtt"
  const topic = "/LaBoiteAHerisson/PetitMessagePourLesHerissons"
  const options = {
    clean: true,
    connectTimeout: 4000,
    clientId: 'herisson',
    username: 'herisson',
    password: 'herisson',
  };

  useEffect(() => {
    const client = mqtt.connect(host, options)
    
    client.on('connect', function () {
      console.log('Connected');
      client.subscribe(topic, function (err) {
        if (!err) {
          console.log('Subscribed to topic:', topic);
        }
      });
    });

    client.on('message', function (topic, message) {
      console.log('Received message:', message.toString())
    });

    return () => {
      client.end(); 
    };
  }, []); 

  const mqttPublish = () => {
    const client = mqtt.connect(host, options)
    client.publish(topic, message, { qos: 2 }, function (error) {
      if (error) {
        console.log('Publish error:', error)
      } else {
        console.log('Message published successfully:', message)
      }
      client.end() 
      setIsOpen(true)
    });
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value)
  };

  const handleClosePopup = () => {
    if(isOpen) {
      setIsOpen(false)
      setMessage('')
    }
  }

  return (
    <div className='container'>
      <img src={herisson} alt="Hérisson" width={300}/>
      <h1>La Boîte à Hérisson</h1>
      <h2>Publier un message</h2>
      <p>Votre message sera affiché au-dessus de l'entrée de la Boîte à Hérisson</p>
      <input type='text' name='message' value={message} onClick={handleClosePopup} onChange={handleInputChange} className='input_txt' />
      <button onClick={mqttPublish}>Publier</button>
      {isOpen ? 
      <div className='popup'>
        <AiOutlineClose className='popup_btn' onClick={handleClosePopup}/>
        <div className='popup_text'>
          <h3>Votre message a été publié !</h3>
          <p>Message : {message}</p>
        </div>
      </div> : ''}
    </div>
  );
}

export default App;
