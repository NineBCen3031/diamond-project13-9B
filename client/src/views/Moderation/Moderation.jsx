import React, { Component, useState, useEffect } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import {getClassroom, getMentor, updateStudent, updateContent } from '../../Utils/requests';
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
        try {
            if (!classroomDetails || !classroomDetails.data || !classroomDetails.data.contents) {
                return;
            }

            const updatedContents = classroomDetails.data.contents.map((content) => {
                if (content.id === contentId) {
                    const moderated = content.moderated === null ? false : !content.moderated;
                    const updatedContent = { ...content, moderated };

                    // Update content via the API for Strapi on the backend.
                    updateContent(contentId, updatedContent)
                        .then(() => console.log('Content updated successfully'))
                        .catch((error) => console.log('Failed to update content:', error));

                    return updatedContent;
                }
                return content;
            });

            // Update the state with the new content data for the button refresh.
            setClassroomDetails({ data: { ...classroomDetails.data, contents: updatedContents } });
        } catch (error) {
            console.error('Error updating content:', error);
        }
    };


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
                    <h2>Gallery Contents:</h2>
                    {console.log("THIS vvvvvvv", classroomDetails["data"].contents)};
                    {classroomDetails["data"].contents && classroomDetails["data"].contents.length > 0 ? (
                        <ul>                                                           {/*This integer determines the threshold for content, min*/}
                            {classroomDetails["data"].contents.filter(content => content.flags === 1).map((content) => (
                                <li key = {content.id}>
                                    {content.description} - Flags: {content.flags}
                                    <button onClick={() => handleModerateContent(content.id)}>
                                        {content.moderated ? 'Unmoderate' : 'Moderate'}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No Gallery content found for this classroom.</p>
                    )}
                </div>
            )}
        </div>
    );
}

