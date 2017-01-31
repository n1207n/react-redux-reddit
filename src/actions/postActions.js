import axios from 'axios';

import * as types from '../constants/postActionTypes';

export function selectSubreddit(subreddit) {
  return {
    type: types.SELECT_SUBREDDIT,
    subreddit
  };
}

export function invalidateSubreddit(subreddit) {
  return {
    type: types.INVALIDATE_SUBREDDIT,
    subreddit
  };
}

export function requestPosts(subreddit) {
  return {
    type: types.REQUEST_POSTS,
    subreddit
  };
}

export function receivePosts(subreddit, json) {
  return {
    type: types.RECEIVE_POSTS,
    subreddit,
    posts: json.data.map(child => child.data),
    receivedAt: Date.now()
  };
}

export function fetchPosts(subreddit) {
  // Using thunk middleware to return an action callback
  return function(dispatch) {
    dispatch(requestPosts(subreddit));

    return axios.get(`https://www.reddit.com/r/${subreddit}.json`)
      .then(response => response.json())
      .then(json => {
        dispatch(receivePosts(subreddit,json));
      })
      .catch(function(error) {
        console.log('fetchPostError', fetchPostError);
      });
  };
}

export function shouldFetchPosts(state, subreddit) {
  const posts = state.postsBySubreddit[subreddit];

  if (!posts) {
    return true;
  } else if (posts.isFetching) {
    return false;
  } else {
    return posts.didInvalidate;
  }
}

export function fetchPostsIfNeeded(subreddit) {
  // Using thunk middleware to return an action callback
  return (dispatch, getState) => {
    if (shouldFetchPosts(getState(), subreddit)) {
      return dispatch(fetchPosts(subreddit));
    } else {
      return Promise.resolve();
    }
  };
}
