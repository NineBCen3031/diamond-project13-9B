import React, { Component, useState, useEffect } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import Thumbnail from '../../assets/casmm_logo.png'
import './Moderation.less';
import {getClassroom, getMentor, updateStudent, updateContent, updateContentFlags} from '../../Utils/requests';
import { useNavigate } from 'react-router-dom';

const ModerationPage = () => {

    const [user, setUser] = useState({});
    const [data, setData] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');

    const [classIds, setClassIds] = useState({});

    const [classroomDetails, setClassroomDetails] = useState({ data: { students: [] } });

    const [selectedContent, setSelectedContent] = useState(null);

    const navigate = useNavigate();
    

    useEffect(() => {
        getData();
    }, []);
    

    const handleContentClick = async (contentId) => {
    
        console.log(classroomDetails.data.contents);
        
         
        const selectedContent = classroomDetails["data"].contents.find(content => content.id === contentId);
        if(selectedContent!== undefined)
            {setSelectedContent(selectedContent);}

        console.log(selectedContent);

    }

    const handleModerationAction = (action) => {
        setSelectedContent(null);
    }


    //This is an async function due to mentor files functions.
    async function getData() {
        try {
            const userData = await getMentor();
            //   console.log(userData);
            setUser(userData);
            setData(userData.data.classrooms);
           // console.log(userData.data.classrooms);

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

    const handleSafeContent = async (contentId) => {
        try {
            setClassroomDetails((prevDetails) => {
                if (!classroomDetails || !classroomDetails.data || !classroomDetails.data.contents) {
                    return prevDetails;
                }

                const updatedContents = classroomDetails.data.contents.map((content) => {
                    let updatedContent = content;

                    if (content.id === contentId) {
                        const updateContent = { ...content, flags: 0 };

                        updateContentFlags(contentId, updateContent)
                            .then(() => console.log('Content flag reset successfully'))
                            .catch((error) => console.log('Failed to reset content flag:', error));

                        updatedContent = updateContent;  // Update the reference of updatedContent
                    }
                    return updatedContent;
                });

                return { data: { ...prevDetails.data, contents: updatedContents } };
            });
        } catch (error) {
            console.error('Error updating content flags:', error);
        }

        setSelectedContent(null);

    };
  
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

        setSelectedContent(null);

    };

    return (

            <div className='container nav-padding'>
                <NavBar />
        
                <div class="moderation-title">Moderation Page</div> 
                
                <button class="HistoryToggle" onClick={() => navigate(`/moderationhistory`)}>
                    View Moderation History
                </button>
        
                <br></br>
        
        <div class="moderation-wrapper">

            <div class = "ClassDropdown">
            Current Classroom:  
            <select class = "Selection"

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
            </div>
            
            {classroomDetails !== null && (
                <div>
                    <div class="ClassroomBox">

                    <div class="RosterTitle"> Classroom Roster </div>
                 
                    {console.log(classroomDetails)} 
                    {(classroomDetails && classroomDetails.data && classroomDetails.data.students) ? (

                    <ul class="StudentGrid">
                        {classroomDetails.data.students.map((student) => (
                            <div class="StudentBox">
                            
                            <li key ={student.id}>{student.name}
                            <br></br>
                                <button onClick={() => handleToggleMute(student.id)} class="MuteButton">
                                    {student.muted ? 'Unmute' : 'Mute'}
                                </button>
                            </li>

                            </div>
                        ))}
                    </ul>
                        ) : (
                            <p>No students found for this classroom.</p>
                        )}
                    </div>
                    
                   
                    <div class="ContentBox">

                    {console.log(classroomDetails.contents)}
                    {classroomDetails["data"].contents && classroomDetails["data"].contents.length > 0 ? (
                        <ul class="ReportGrid">                                                           {/*This integer determines the threshold for content, and next to it says that if the content hasn't been moderated then print it out to the moderation page. Yet if the content is moderated then don't print it out to the moderation page but instead the moderation history as it already been handled.*/}
                            {classroomDetails["data"].contents.filter(content => content.flags === 1 && content.moderated === false).map((content) => (
                                <li key = {content.id} onClick={() => handleContentClick(content.id)}>
                                    <div class="ItemBox">

                                    <div class = "ItemText">
                                    {content.description}
                                    </div>

                                    <img src = {Thumbnail} class = "postThumbnail" alt ="Thumbnail" />
                        
                                    <div class = "FlagDisplay">
                                    {content.flags} Flags
                                    </div>

                                    </div>
                                </li>

                                
                            ))}
                        </ul>
                    ) : (
                        <h>No reported content found for this classroom.</h>
                    )}
                    
                    </div>

                    {selectedContent && (

                    <div>
                    <div class = "overlay"> </div>
                    <div class = "ReportBox">

                     <br></br>

                        <div>
                        <div class= "FlagDisplay2">{selectedContent.flags} Flags</div>
                        </div>
                        <p>Title: {selectedContent.description}</p>
                        <p>Description: {selectedContent.description}</p>

                            <div>
                            {selectedContent.ReportReason}
                            </div>

                        <button onClick={() => handleSafeContent(selectedContent.id)} class = "approveButton" >Approve Post</button>
                        <button onClick={() => handleModerateContent(selectedContent.id)} class = "rejectButton" >Reject Post</button>

                        

                    </div>
                    </div>
                    )}
                     

                </div>
            )}
        </div>
        </div>
    );
}

export default ModerationPage;