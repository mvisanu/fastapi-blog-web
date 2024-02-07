import React, { useState } from "react";
import './NewPost.css'

const BASE_URL = 'http://localhost:8000/'

function NewPost() {

  const [image, setImage] = useState(null)
  const [creator, setCreator] = useState('')
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')

  const handleImageUpload = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleCreate = (e) => {
  e?.preventDefault();

  const formData = new FormData();
  if (image) {
    formData.append('image', image);
  } else {
    // Handle case where image is not selected or null
    console.error('No image selected');
    return;
  }

  const requestOptions = {
    method: 'POST',
    body: formData,
  };

  fetch(BASE_URL + 'post/image', requestOptions)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    })
    .then(data => {
      createPost(data.filename);
    })
    .catch(error => {
      console.error('Error:', error);
    })
    .finally(() => {
      setImage(null); // Assuming setImage is from useState
      const fileInput = document.getElementById('fileInput');
      if (fileInput) fileInput.value = '';
    });
}


  const createPost = (imageUrl) => {
    const json_string = JSON.stringify({
      'image_url': imageUrl,
      'title': title,
      'content': text,
      'creator': creator
    })

    const requestOptions = {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: json_string
    }

    fetch(BASE_URL + 'post', requestOptions)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw response
      })
      .then(data => {
        window.location.reload()
        window.scrollTo(0,0)
      })
      .catch(error => {
        console.log(error);
      })
  }

  return (
    <div className="newpost_content">
      <div className="newpost_image">
        <input type="file" id="fileInput" onChange={handleImageUpload} />
      </div>
      <div className="newpost_creator">
        <input className="newpost_creator" type="text" id="create_input"
          placeholder="Creator" onChange={(event) => setCreator(event.target.value)} 
          value={creator}
        />
      </div>
      <div className="newpost_title">
        <input className="newpost_title" type="text" id="title_input"
          placeholder="Title" onChange={(event) => setTitle(event.target.value)} 
          value={title} />
      </div>
      <div className="newpost_text">
        <textarea className="newpost_text" rows='10' id="content_input"
          placeholder="Content" onChange={(event) => setText(event.target.value)} 
          value={text} />
      </div>
      <div>
        <button className="create_button" onClick={handleCreate}>Create</button>
      </div>
    </div>
  )

  
}

export default NewPost