import React, { Component } from 'react';

import Image from '../../../components/Image/Image';
import './SinglePost.css';

// Wrapper to inject params into class component (React Router v6 removed withRouter)
import { useParams } from 'react-router-dom';

function withParams(WrappedComponent) {
  return function WithParamsWrapper(props) {
    const params = useParams();
    return <WrappedComponent {...props} params={params} />;
  };
}

class SinglePost extends Component {
  state = {
    title: '',
    author: '',
    date: '',
    image: '',
    content: ''
  };

  componentDidMount() {
    const postId = this.props.params.postId;
    fetch('http://localhost:8080/feed/post/' + postId, {
      headers: {
        Authorization: 'Bearer ' + this.props.token
      }
    })
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Failed to fetch post');
        }
        return res.json();
      })
      .then(resData => {
        this.setState({
          title: resData.post.title,
          // creator is now populated in backend (getPost uses .populate('creator'))
          author: resData.post.creator ? resData.post.creator.name : 'Unknown',
          image: 'http://localhost:8080/' + resData.post.imageUrl,
          date: new Date(resData.post.createdAt).toLocaleDateString('en-US'),
          content: resData.post.content
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  render() {
    return (
      <section className="single-post">
        <h1>{this.state.title}</h1>
        <h2>
          Created by {this.state.author} on {this.state.date}
        </h2>
        <div className="single-post__image">
          <Image contain imageUrl={this.state.image} />
        </div>
        <p>{this.state.content}</p>
      </section>
    );
  }
}

export default withParams(SinglePost);
