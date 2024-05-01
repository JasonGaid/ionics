// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButtons, IonBackButton, IonIcon, IonCard, IonCardContent } from '@ionic/react';
// import { useHistory } from 'react-router-dom';
// import { arrowBackOutline } from 'ionicons/icons'; // Import Ionicons arrow back icon

// const Details: React.FC = () => {
//   const [blogs, setBlogs] = useState([]);
//   const history = useHistory(); // Initialize useHistory hook

//   useEffect(() => {
//     fetchBlogs();
//   }, []);

//   const fetchBlogs = async () => {
//     try {
//       const response = await axios.get('http://127.0.0.1:8000/api/blogs');
//       setBlogs(response.data);
//     } catch (error) {
//       console.error('Error fetching blogs:', error);
//     }
//   };


//   const navigateToHome = () => {
//     history.push('/home');
//   };

//   return (
//     <IonPage>
//       <IonHeader>
//         <IonToolbar className="details-header"> {/* Add custom class for header */}
//           <IonButtons slot="start"> {/* Use slot="start" to position the button on the left */}
//             <IonBackButton defaultHref="/home">
//               <IonIcon icon={arrowBackOutline} /> {/* Use Ionicons arrow back icon */}
//               Back {/* Custom text for the back button */}
//             </IonBackButton>
//           </IonButtons>
//           <IonTitle>List of Blogs</IonTitle>
//         </IonToolbar>
//       </IonHeader>
//       <IonContent fullscreen className="details-content"> {/* Apply linear background here */}
//         <IonHeader collapse="condense">
//           <IonToolbar>
//             <IonTitle size="large">List of Blogs</IonTitle>
//           </IonToolbar>
//         </IonHeader>
//         <IonList>
//           {blogs.map((blog: any) => (
//             <IonItem key={blog.id}>
//               <IonCard className="blog-card"> {/* Card-like layout */}
//                 <IonCardContent>
//                   <IonLabel>{blog.title}</IonLabel>
//                   <p>Content: {blog.content}</p>
//                   <p>Category: {blog.category}</p>
//                   <img src={blog.image} alt={blog.title} style={{ maxWidth: '100%', height: 'auto' }} />
//                 </IonCardContent>
//               </IonCard>
//             </IonItem>
//           ))}
//         </IonList>
//       </IonContent>
//     </IonPage>
//   );
// };

// export default Details;