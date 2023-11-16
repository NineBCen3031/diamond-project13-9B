import React, { Component, useState, useEffect } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import {getClassroom, getMentor } from '../../Utils/requests';



export default function ModerationPage() {
    const [user, setUser] = useState({});
    const [data, setData] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');

    const [classIds, setClassIds] = useState({});

    const [classroomDetails, setClassroomDetails] = useState(null);

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

            const classIds = userData.data.classrooms.map((classroom) => classroom.id);
            setClassIds(classIds);
        }
        catch (error){
            console.error('Error fetching data: ', error);
        }
    }

    async function handleClassroomChange(classId) {
        try {
            const details = await getClassroom(classId);
            setClassroomDetails(details);
        }
        catch (error) {
            console.error('Error fetching classroom details: ', error);
        }
    }



    return (
        <div>
            <h1>Moderation Page</h1>
            <label>Select Classroom:</label>
            <select

                value={selectedOption}
                onChange={(e) => {
                    const selectedId = e.target.value;
                    setSelectedOption(selectedId);
                    handleClassroomChange(selectedId);
                    }}
            >
                {console.log(selectedOption)};
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
            {classroomDetails !== null && (
                <div>
                    <h2>Classroom Roster</h2>
                    <h3>Students:</h3>
                    {(classroomDetails.data && classroomDetails.data.students) ? (

                    <u1>
                        {classroomDetails.data.students.map((student) => (
                            <li key ={student.id}>{student.name}</li>
                        ))}
                    </u1>
                        ) : (
                            <p>No students found for this classroom.</p>
                        )}
                </div>
            )}
        </div>
    );
}

