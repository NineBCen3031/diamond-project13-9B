import React, { useEffect, useState } from 'react';
import './Gallery.less';
import MentorSubHeader from '../../../../components/MentorSubHeader/MentorSubHeader';
import { Form, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getMentor, getClassroom, updateContentFlags, updateReportReason} from '../../../../Utils/requests';

export default function Gallery({ classroomId }) {
  const [user, setUser] = useState({});
  const [data, setData] = useState([]);
  const [classIds, setClassIds] = useState({});
  const [classroomDetails, setClassroomDetails] = useState(null);


    useEffect(() => {
        getData();
    }, []);
  const navigate = useNavigate();
  const handleBack = () => {
    navigate('/dashboard');
  };
  async function getData() {
    try {
        const userData = await getMentor();
        console.log(userData);
        setUser(userData);
        setData(userData.data.classrooms);
        console.log(userData.data.classrooms);

        const classIds = userData.data.classrooms.map((classroom) => classroom.id);
        setClassIds(classIds);
        const details = await getClassroom(classroomId);
        setClassroomDetails(details);
    }
    catch (error){
        console.error('Error fetching data: ', error);
    }
  }

  const handleReport = async (contentId) => {
    try {
        if (!classroomDetails || !classroomDetails.data || !classroomDetails.data.contents) {
            return;
        }

        {/*Increases the flag count for the content that is reported*/}
        const updatedContents = classroomDetails.data.contents.map((content) => {
            if (content.id === contentId) {
                const flags = content.flags + 1;
                const updatedContent = { ...content, flags };

                // Update content via the API for Strapi on the backend.
                console.log('Updating content:', updatedContent);
                updateContentFlags(content.id, updatedContent)
                    .then(() => console.log('Content updated successfully'))
                    .catch((error) => console.log('Failed to update content flags:', error));

                var ReportReason = prompt("Please enter a reason for reporting this content");
                const updatedContent2 = { ...updatedContent, ReportReason };
                updateReportReason(content.id, updatedContent2)
                    .then(() => console.log('Content updated successfully'))
                    .catch((error) => console.log('Failed to update content reason:', error));
                console.log('Updating content:', updatedContent2);
                return updatedContent2;
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
      <button id='home-back-btn' onClick={handleBack}>
        <i className='fa fa-arrow-left' aria-hidden='true' />
      </button>
      <MentorSubHeader
        title={'Gallery'}
        classroomId={classroomId}
      />
        
            {classroomDetails !== null && (
                <div id ='card-container'>
                    {(classroomDetails.data && classroomDetails.data.contents != null) ? (

                    <div id='content-box'>
                      <div>
                        {/*Displays any content in the classroom that has not been flagged*/}
                         {classroomDetails["data"].contents.filter(content => content.flags === 0).map((content) => (
                                <li key ={content.id}>Description: {content.description} 
                                <div>Flag count: {content.flags}</div>
                                <button onClick={() => handleReport(content.id)}>
                                           Report
                                        </button>
                                </li> 
                            ))}</div>
                    </div>
                        ) : (
                            <div>No content found for this classroom.</div>
                        )}
                </div>
            )}    
      
    </div>
  );
}

