import { combineReducers } from 'redux';
import objectAssign from 'object-assign';

import { initialSelectedSubreddit, initialPosts } from './initialState';

import * as types from '../constants/postActionTypes';

function selectSubreddit(state = initialSelectedSubreddit, action) {
  switch (action.type) {
    case types.SELECT_SUBREDDIT:
      return action.subreddit;

    default:
      return state;
  }
}

function posts(state = {
  isFetching: false,
  didInvalidate: false,
  items: []}, action) {
  switch (action.type) {
    case types.REQUEST_POSTS:
      return objectAssign({}, state, {
        isFetching: true,
        didInvalidate: false,
      });

    case types.RECEIVE_POSTS:
      return objectAssign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: actions.posts,
        lastUpdated: action.receivedAt
      });

    case types.INVALIDATE_SUBREDDIT:
      return objectAssign({}, state, {
        didInvalidate: true,
      });

    default:
      return state;
  }
}

function postsBySubreddit(state = initialPosts, action) {
  switch (action.type) {
    case types.REQUEST_POSTS:
    case types.RECEIVE_POSTS:
    case types.INVALIDATE_SUBREDDIT:
      return objectAssign({}, state, {
        [action.subreddit]: posts(state[action.subreddit], action),
      });

    default:
      return state;
  }
}

const postReducer = combineReducers(
  selectedSubreddit,
  postsBySubreddit
);

export default postReducer;
