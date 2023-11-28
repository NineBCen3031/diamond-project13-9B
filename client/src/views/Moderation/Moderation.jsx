import React, { Component, useState, useEffect } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import {getClassroom, getMentor, updateStudent } from '../../Utils/requests';
import studentComponent from "../Student/Student";



export default function ModerationPage() {
    const [user, setUser] = useState({});
    const [data, setData] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');

    const [classIds, setClassIds] = useState({});

    const [classroomDetails, setClassroomDetails] = useState({ data: { students: [] } });

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

    const handleToggleMute = async (studentId) => {
        try {
            setClassroomDetails((prevDetails) => {
                if (!prevDetails || !prevDetails.data || !prevDetails.data.students) {
                    return prevDetails;
                }

                const updatedStudents = prevDetails.data.students.map((student) => {
                    if (student.id === studentId) {
                        const muted = student.muted === null ? false : !student.muted;
                        const updatedStudent = { ...student, muted };

                        // Update the student on the server
                        updateStudent(student.id, updatedStudent)
                            .then(() => console.log('Student updated successfully'))
                            .catch((error) => console.log('Failed to update student:', error));

                        return updatedStudent;
                    }
                    return student;
                });

                // Update the state with the new student data
                return { data: { ...prevDetails.data, students: updatedStudents } };
            });
        } catch (error) {
            console.error('Error updating student:', error);
        }
    };

    const handleModerateContent = async (contentId) => {
        try{
            //Fetching the classroom details for obtain the content within gallery page.
            const updatedDetails = await getClassroom(selectedOption);
            setClassroomDetails(updatedDetails);

            const contentToModerate = updatedDetails.contents.find(
                (content) => content.id === contentId
            );

            //trying to update moderation status
            if(contentToModerate){
                const updatedContent = {
                    ...contentToModerate,
                    moderated: !contentToModerate.moderated,
                };
                //call to the API to update the moderated status
                //updateContent(contentId, updatedContent);
            }
        }

        catch(error){
            console.error('Error moderating content:', error);
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
                    {console.log(classroomDetails)};
                    {(classroomDetails && classroomDetails.data && classroomDetails.data.students) ? (

                    <ul>
                        {classroomDetails.data.students.map((student) => (
                            <li key ={student.id}>{student.name}
                                <button onClick={() => handleToggleMute(student.id)}>
                                    {student.muted ? 'Unmute' : 'Mute'}
                                </button>
                            </li>
                        ))}
                    </ul>
                        ) : (
                            <p>No students found for this classroom.</p>
                        )}
                    <h4>Gallery Contents:</h4>
                    {console.log(classroomDetails.contents)};
                    {classroomDetails.contents && classroomDetails.contents.length > 0 ? (
                        <u1>
                            {classroomDetails.contents.map((content) => (
                                <li key = {content.id}>
                                    {content.description} - Flags: {content.flags}
                                    <button onClick={() => handleModerateContent(content.id)}>
                                        {content.moderated ? 'Unmoderate' : 'Moderate'}
                                    </button>
                                </li>
                            ))}
                        </u1>
                    ) : (
                        <p>No Gallery content found for this classroom.</p>
                    )}
                </div>
            )}
        </div>
    );
}

