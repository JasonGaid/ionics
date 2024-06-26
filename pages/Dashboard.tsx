import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { IonPopover, IonList, IonItem, IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonFooter, IonModal, IonInput, IonSelect, IonSelectOption, useIonToast } from '@ionic/react';
import { logOutOutline, createOutline, trashOutline, pencilOutline,closeCircleOutline  } from 'ionicons/icons';

const Dashboard: React.FC = () => {
  const [present] = useIonToast();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryData, setSelectedCategoryData] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [popoverState, setShowPopover] = useState({ showPopover: false, event: undefined });
  const history = useHistory();

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      setUser(user);
    } else {
      history.push('/login');
    }

    fetchCategories();
    fetchPosts();
  }, [history]);

  async function fetchCategories() {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      present({
        message: 'Failed to fetch categories',
        duration: 3000,
        position: 'top',
      });
    }
  }

  async function fetchCategoryData(selectedCategory: string) {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/categories?name=${selectedCategory}`);
      setSelectedCategoryData(response.data);
    } catch (error) {
      console.error('Error fetching category data:', error);
      present({
        message: 'Failed to fetch category data',
        duration: 3000,
        position: 'top',
      });
    }
  }

  async function createBlog() {
    try {
      if (!category) {
        present({
          message: 'Please select a category',
          duration: 3000,
          position: 'top',
        });
        return;
      }

      const formData = new FormData();
      formData.append('user_id', user.id);
      formData.append('title', title);
      formData.append('content', content);
      formData.append('category_id', category.id);

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await axios.post('http://127.0.0.1:8000/api/create-post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        present({
          message: 'Blog Created Successfully',
          duration: 3000,
          position: 'top',
        });
        setShowModal(false);
        fetchPosts();
      } else {
        const responseData = response.data;
        if (responseData.errors) {
          const errorMessages = Object.values(responseData.errors).join(', ');
          present({
            message: `Validation Error: ${errorMessages}`,
            duration: 5000,
            position: 'top',
          });
        } else {
          present({
            message: 'Failed to create blog',
            duration: 3000,
            position: 'top',
          });
        }
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      present({
        message: 'Failed to create blog',
        duration: 3000,
        position: 'top',
      });
    }
  }

  async function fetchPosts() {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/posts');
      const sortedPosts = [...response.data].sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateB.getTime() - dateA.getTime();
      });
      setPosts(sortedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      present({
        message: 'Failed to fetch posts',
        duration: 3000,
        position: 'top',
      });
    }
  }

  const handleEditPost = (post: any) => {
    setEditingPost(post);
    setTitle(post.title);
    setContent(post.content);
    setCategory(post.category);
    setShowModal(true);
  };

  const handleDeletePost = async (post: any) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/api/posts/${post.id}`);

      if (response.status >= 200 && response.status < 300) {
        present({
          message: 'Post Deleted Successfully',
          duration: 3000,
          position: 'top',
        });
        fetchPosts();
      } else {
        present({
          message: 'Failed to delete post',
          duration: 3000,
          position: 'top',
        });
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      present({
        message: 'Failed to delete post',
        duration: 3000,
        position: 'top',
      });
    }
  };

  // Dashboard Component - handleEditSubmit Function
  const handleEditSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (category) {
        formData.append('category_id', category.id);
      }
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await axios.put(`http://127.0.0.1:8000/api/posts/${editingPost.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        present({
          message: 'Post Updated Successfully',
          duration: 3000,
          position: 'top',
        });
        setShowModal(false);
        fetchPosts();
      } else {
        present({
          message: 'Failed to update post',
          duration: 3000,
          position: 'top',
        });
      }
    } catch (error) {
      console.error('Error updating post:', error);
      present({
        message: 'Failed to update post',
        duration: 3000,
        position: 'top',
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user'); // Remove user from local storage
    history.push('/login');
    window.location.reload(); // Force reload of the page
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Blogging Platform</IonTitle>
          {user && (
            <IonItem lines="none" slot="end">
              <IonButton onClick={(e: any) => setShowPopover({ showPopover: true, event: e.nativeEvent })} className="welcome-button">
                Welcome, {user.name}
              </IonButton>
              <IonPopover
                isOpen={popoverState.showPopover}
                event={popoverState.event}
                onDidDismiss={() => setShowPopover({ showPopover: false, event: undefined })}
              >
                <IonList>
                  <IonItem button onClick={handleLogout}>
                    <ion-icon icon={logOutOutline} style={{ color: 'red', marginRight: '8px' }}></ion-icon> Logout
                  </IonItem>
                </IonList>
              </IonPopover>
            </IonItem>
          )}
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonButton
              onClick={() => {
                setEditingPost(null);
                setTitle('');
                setContent('');
                setCategory(null);
                setImageFile(null);
                setShowModal(true);
              }}
            >
              <ion-icon icon={createOutline} style={{ marginRight: '8px' }}></ion-icon>Create Blog
            </IonButton>
          </IonItem>
        </IonList>
        {posts.map((post, index) => (
          <IonCard key={index}>
            <IonCardHeader>
              <IonCardSubtitle>Posted by: {post.user.name}</IonCardSubtitle>
              <IonCardTitle>{post.title}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>{post.content}</p>
              {post.image && <img src={`http://127.0.0.1:8000/api/${post.image}`} alt="Blog" />}
            </IonCardContent>
            {user && user.id === post.user.id && (
              <IonFooter>
                <IonButton onClick={() => handleEditPost(post)} style={{ '--background': 'green' }}>
                  <ion-icon icon={pencilOutline} style={{ marginRight: '8px' }}></ion-icon>Edit
                </IonButton>
                <IonButton onClick={() => handleDeletePost(post)} style={{ '--background': 'red' }}>
                  <ion-icon icon={trashOutline} style={{ marginRight: '8px' }}></ion-icon>Delete
                </IonButton>
              </IonFooter>
            )}
          </IonCard>
        ))}
      </IonContent>

      <IonModal isOpen={showModal}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{editingPost ? 'Edit Post' : 'Create Blog'}</IonTitle>
            <IonButton slot="end" onClick={() => setShowModal(false)} color="danger">
            <ion-icon icon={closeCircleOutline}></ion-icon>
            </IonButton>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            <IonItem>
              <IonInput
                name="title"
                type="text"
                label="Title"
                labelPlacement="floating"
                placeholder="Enter Title"
                value={title}
                onIonChange={(e: any) => setTitle(e.target.value)}
              />
            </IonItem>
            <IonItem>
              <IonInput
                name="content"
                type="text"
                label="Content"
                labelPlacement="floating"
                placeholder="Enter Content"
                value={content}
                onIonChange={(e: any) => setContent(e.target.value)}
              />
            </IonItem>
            <IonItem>
              <IonSelect
                name="category"
                placeholder="Select Category"
                value={category}
                onIonChange={(e: any) => {
                  const selectedCategory = e.detail.value;
                  setCategory(selectedCategory);
                  fetchCategoryData(selectedCategory.id);
                }}
              >
                {categories.map((cat) => (
                  <IonSelectOption key={cat.id} value={cat}>
                    {cat.name}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
            <IonItem>
              <input type="file" accept="image/*" onChange={(e: any) => setImageFile(e.target.files[0])} />
            </IonItem>
          </IonList>
          <IonButton onClick={editingPost ? handleEditSubmit : createBlog} expand="full">
            {editingPost ? 'Update Post' : 'Create Blog'}
          </IonButton>
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

export default Dashboard;
