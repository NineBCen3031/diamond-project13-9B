import React, { Component, useState, useEffect } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import Thumbnail from '../../assets/casmm_logo.png'
import './Moderation.less';
import {getClassroom, getMentor, updateContent, updateStudent } from '../../Utils/requests';

const Dropdown = () => {
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
        <div class="ClassroomBox">

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

            {       
            /*
            <div>
                {selectedOption && (
                    <p>You selected: {selectedOption}</p>
                )}
            </div>
            */
            }
            
            {classroomDetails !== null && (
                <div>

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

                    {
                    /*
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
                    */
                    }   

                </div>
            )}
        </div>
    );
}

class ModerationPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contentData: [
                { id: 1, title: 'Content 1', description: 'This is the first content item', 
                reports: ["User 1 - Inappropriate content", "User 2 - Plagiarism", "User 3 - Hate speech", "User 4 - Inappropriate content", "User 5 - Plagiarism", "User 6 - Hate speech", "User 7 - Inappropriate content","User 8 - Inappropriate content", "User 9 - Plagiarism", "User 10 - Hate speech", "User 11 - Inappropriate content",  ], flags: 11},
                { id: 2, title: 'Content 2', description: 'This is the second content item', 
                reports: ["User 1 - Inappropriate content", "User 2 - Plagiarism", "User 3 - Hate speech", "User 4 - Inappropriate content", "User 5 - Plagiarism", "User 6 - Hate speech", "User 7 - Inappropriate content","User 8 - Inappropriate content", "User 9 - Plagiarism", "User 10 - Hate speech", "User 11 - Inappropriate content",  ], flags: 11},
                { id: 3, title: 'Content 3', description: 'This is the third content item', 
                reports: ["User 1 - Inappropriate content", "User 2 - Plagiarism", "User 3 - Hate speech", "User 4 - Inappropriate content", "User 5 - Plagiarism", "User 6 - Hate speech", "User 7 - Inappropriate content", ], flags: 7 },
                { id: 4, title: 'Content 4', description: 'Report Details',
                reports: ["User 1 - Inappropriate content", "User 2 - Plagiarism", "User 3 - Hate speech", "User 4 - Inappropriate content", "User 5 - Plagiarism", "User 6 - Hate speech", "User 7 - Inappropriate content", ], flags: 7 },
                { id: 5, title: 'Content 5', description: 'Report Details', 
                reports: ["User 1 - Inappropriate content", "User 2 - Plagiarism", "User 3 - Hate speech", "User 4 - Inappropriate content", "User 5 - Plagiarism", "User 6 - Hate speech", "User 7 - Inappropriate content", ], flags: 7 },
                { id: 6, title: 'Content 6', description: 'Report Details', 
                reports: ["User 1 - Inappropriate content", "User 2 - Plagiarism", "User 3 - Hate speech", "User 4 - Inappropriate content", "User 5 - Plagiarism", "User 6 - Hate speech", "User 7 - Inappropriate content", ], flags: 7 },
                { id: 7, title: 'Content 7', description: 'Report Details', 
                reports: ["User 1 - Inappropriate content", "User 2 - Plagiarism", "User 3 - Hate speech", "User 4 - Inappropriate content", "User 5 - Plagiarism", "User 6 - Hate speech", "User 7 - Inappropriate content", ], flags: 7 },
                { id: 8, title: 'Content 8', description: 'Report Details', 
                reports: ["User 1 - Inappropriate content", "User 2 - Plagiarism", "User 3 - Hate speech", "User 4 - Inappropriate content", "User 5 - Plagiarism", "User 6 - Hate speech", "User 7 - Inappropriate content", ], flags: 7 },
                { id: 9, title: 'Content 9', description: 'Report Details', 
                reports: ["User 1 - Inappropriate content", "User 2 - Plagiarism", "User 3 - Hate speech", "User 4 - Inappropriate content", "User 5 - Plagiarism", "User 6 - Hate speech", "User 7 - Inappropriate content", ], flags: 7 },
                { id: 10, title: 'Content 10', description: 'Report Details', 
                reports: ["User 1 - Inappropriate content", "User 2 - Plagiarism", "User 3 - Hate speech"], flags: 3 },
                { id: 11, title: 'Content 11', description: 'Report Details', 
                reports: ["User 1 - Inappropriate content", "User 2 - Plagiarism", "User 3 - Hate speech"], flags: 3 },
                { id: 12, title: 'Content 12', description: 'Report Details', 
                reports: ["User 1 - Inappropriate content", "User 2 - Plagiarism", "User 3 - Hate speech"], flags: 3 },
                { id: 13, title: 'Content 13', description: 'Report Details', 
                reports: ["User 1 - Inappropriate content", "User 2 - Plagiarism", "User 3 - Hate speech"], flags: 3 },
                { id: 14, title: 'Content 14', description: 'Report Details', 
                reports: ["User 1 - Inappropriate content", "User 2 - Plagiarism", "User 3 - Hate speech"], flags: 3 },
                { id: 15, title: 'Content 15', description: 'Report Details', 
                reports: ["User 1 - Inappropriate content", "User 2 - Plagiarism", "User 3 - Hate speech"], flags: 3 },
                
                
                // Add more content items here
            ],
            showContent: false,
            selectedContent: null,
        };


    }

    handleContentClick = (contentId) => {
        const selectedContent = this.state.contentData.find(content => content.id === contentId);
        this.setState({ selectedContent });
    }

    handleModerationAction = (action) => {
        // Perform your moderation action here, e.g., hide, delete, or approve content
        // Update the contentData and UI accordingly

        // Example: Removing the content from the list
        const updatedContentData = this.state.contentData.filter(content => content.id !== this.state.selectedContent.id);
        this.setState({
            contentData: updatedContentData,
            selectedContent: null,
        });
    }

    render() {
        const { contentData, selectedContent } = this.state;

        

        return (

            
            <div className='container nav-padding'>
                <NavBar />

                <div id='moderation-title'>Moderation Page</div> 
                
                <div id='moderation-wrapper'>

                <br></br>
                    

                {/* Content List */}

                 <Dropdown/>

             
                
                <div class = "ContentBox">
                    
                <ol class = "ReportGrid">
                    {contentData.map(content => (

                       

                        <li key={content.id} onClick={() => this.handleContentClick(content.id)}>
                            <div class = "ItemBox">
                                

                                <div class = "ItemText">
                                {content.title}
                                </div>

                                <img src = {Thumbnail} class = "postThumbnail" alt ="Thumbnail" />
                        
                                <div class = "FlagDisplay">
                                {content.flags} Flags
                                </div>
                            
                            </div>
                        </li>

                    ))}
                </ol>             
            
            </div>

            </div>
        
            {selectedContent && (
                    <div>
                    <div class = "overlay"> </div>
                    <div class = "ReportBox">

                     <br></br>

                        <div>
                        <div class= "FlagDisplay2">{selectedContent.flags} Flags</div>
                        </div>

                        <p>Title: {selectedContent.title}</p>
                        <p>Description: {selectedContent.description}</p>

                            <div>
                            {selectedContent.reports.map(reportText => <p><div class = "reportsDisplay">{reportText}</div></p>)}
                            </div>

                        <button onClick={() => this.handleModerationAction('approve')} class = "approveButton" >Approve Post</button>
                        <button onClick={() => this.handleModerationAction('reject')} class = "rejectButton" >Reject Post</button>
                        

                    </div>
                    </div>
                )}

                <br></br>
                <br></br>

            </div>
            
        );
    }
}

export default ModerationPage;