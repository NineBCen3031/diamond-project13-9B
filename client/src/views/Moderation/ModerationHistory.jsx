import React, { Component, useState, useEffect } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import MentorSubHeader from '../../components/MentorSubHeader/MentorSubHeader';
import './ModerationHistory.less';
import {getClassroom, getMentor } from '../../Utils/requests';

export default function ModerationPageHistory() {
    
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
            <div className='container nav-padding'>
                <NavBar />
                <div id='moderation-title'>Moderation History</div> 
                <div id='moderation-wrapper'></div>
                
            <div id="classroom-box">  
                <div id="class-dropdown">Select Classroom:
                    <select id='Selection1'

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
            </div>
            
           
           
            {classroomDetails !== null && (
                <div>
                    {(classroomDetails.data) ? (
                        
                    <div>
                        {console.log(classroomDetails)}
                        {classroomDetails["data"].contents && classroomDetails["data"].contents.length > 0 ? (
                        <ul>                                                        
                            {classroomDetails["data"].contents.filter(content => content.moderated === true).map((content) => (
                                <li id ='content-box' key = {content.id}>
                                    <h3>Content Description: {content.description}</h3>
                                    <div>Status: Moderated</div>
                                    <div>Flags: {content.flags}</div>
                                    <div>Reason for Report: {content.ReportReason}</div>
                                    <div>Posted by 
                                            {classroomDetails.data.students.map((student) => (
                                                <>
                                                    {student.id === content.student? <> {student.name}</> : null}
                                                </>
                                            ))}
                                    </div>
                                    {console.log(content)}
                                </li>
                            ))}
                            {classroomDetails["data"].contents.filter(content => content.moderated === false).map((content) => (
                                <li id = 'content-box' key = {content.id}>
                                    <h3>Content Description: {content.description}</h3>
                                    <div>
                                    <div>Status: Not Moderated</div>
                                    <div>Flags: {content.flags}</div>
                                    <div>Reason for Report: {content.ReportReason}</div>
                                    <div>Posted by 
                                            {classroomDetails.data.students.map((student) => (
                                                <>
                                                    {student.id === content.student? <> {student.name}</> : null}
                                                </>
                                            ))}
                                    </div></div>
                                </li>
                            ))}
                            
                        </ul>
                    ) : (
                        <p>No Gallery content found for this classroom.</p>
                    )}
                        
                        
                    </div>
                        ) : (
                            <div>
                            <p>Please select a classroom</p>
                            </div>
                        )}
                </div>
            )}
                
            </div>
            </div>
        ); 
}

