import React, { Component, useState, useEffect } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import {getAllClassrooms, getMentor } from '../../Utils/requests';



export default function ModerationPage() {
    const [user, setUser] = useState({});
    const [data, setData] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');

    useEffect(() => {
        getData();
    }, []);


    //This is an async function due to mentor files functions.
    async function getData() {
        try {
            const userData = await getMentor();
            console.log(userData);
            setUser(userData);
            setData(userData.data.classrooms);
            console.log(userData.data.classrooms);
        }
        catch (error){
            console.error('Error fetching data: ', error);
        }
    }

    return (
        <div>
            <h1>Moderation Page</h1>
            <label>Select Classroom:</label>
            <select
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
            >
                <option value="">Select an option</option>
                {data.map((classroom, index) => (
                    <option key={index} value={classroom.id}>
                        {classroom.name}
                    </option>
                ))}
            </select>
            <div>
                {selectedOption && (
                    <p>You selected: {selectedOption}</p>
                )}
            </div>
        </div>
    );
}

