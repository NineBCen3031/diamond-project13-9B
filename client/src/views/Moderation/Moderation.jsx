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


    //This useEffects function is here to populate the moderation page with data depending on the user that's signed in instantly once they click to go to the page.
    useEffect(() => {
        getData();
    }, []);


    //This is an async function due to mentor files functions.
    async function getData() {
        try {
            const userData = await getMentor();
            setUser(userData);
            setData(userData.data.classrooms);

            //Get the data of the users specific classrooms, so that they are only allowed to moderate their classes and not others.
            const classIds = userData.data.classrooms.map((classroom) => classroom.id);
            setClassIds(classIds);
        }
        catch (error){
            console.error('Error fetching data: ', error);
        }
    }

    //This function is for the drop down menu to allow for the change in classroom data depending on which class the user has selected.
    async function handleClassroomChange(classId) {
        try {
            const details = await getClassroom(classId);
            setClassroomDetails(details);
        }
        catch (error) {
            console.error('Error fetching classroom details: ', error);
        }
    }

    //This function handles the mute buttons next to the student roster list that's populated in the moderation page once a user selects a classroom, so that a teacher can prevent any and all students from being able to post content to the gallery page.
    const handleToggleMute = async (studentId) => {
        try {
            setClassroomDetails((prevDetails) => {
                if (!prevDetails || !prevDetails.data || !prevDetails.data.students) {
                    return prevDetails;
                }

                //iterator to find the correct student via their IDs to toggle the muted boolean.
                const updatedStudents = prevDetails.data.students.map((student) => {
                    if (student.id === studentId) {
                        const muted = student.muted === null ? false : !student.muted;
                        const updatedStudent = { ...student, muted };

                        // Update the student data on the server
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

    //This function handles the moderate button for the content that get posted to the individual classrooms, and allows for a teacher to reject/hide the post if they toggle the boolean. Yet the only way that happens is if the content has been flag by a user to then get sent to the moderation page.
    const handleModerateContent = async (contentId) => {
        try {
            if (!classroomDetails || !classroomDetails.data || !classroomDetails.data.contents) {
                return;
            }

            //iterator to find the correct content via its IDs to toggle the moderated boolean, and if it's been set to null, which it shouldn't be, but if it is then set it to false before attempting to toggle.
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

                    {(classroomDetails && classroomDetails.data && classroomDetails.data.students) ? (

                    <ul> {/*iterate through the list of student and print them out with a button the calls the handleToggleMute function.*/}
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

                    {classroomDetails["data"].contents && classroomDetails["data"].contents.length > 0 ? (
                        <ul>                                                           {/*This integer determines the threshold for content, and next to it says that if the content hasn't been moderated then print it out to the moderation page. Yet if the content is moderated then don't print it out to the moderation page but instead the moderation history as it already been handled.*/}
                            {classroomDetails["data"].contents.filter(content => content.flags === 1 && content.moderated === false).map((content) => (
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

