import * as Redux from 'redux'

import { POSTS } from '../constants/posts'

type Action = {
  type: 'FETCH_ALL_POSTS' | 'FILTER_POSTS_BY_USER_ID'
  payload?: { userId: number }
}

const fetchPosts = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts')
  const posts = await response.json()
  return posts
}

const setUserIds = (posts: typeof POSTS) => {
  const select = document.querySelector<HTMLSelectElement>('#user-id-select')
  if (!select) return

  const userIds = posts.map(post => post.userId)
  const uniqueUserIds = [...new Set(userIds)]
  uniqueUserIds.forEach(userId => {
    const option = document.createElement('option')
    option.value = String(userId)
    option.textContent = String(userId)
    select.appendChild(option)
  })

  select.addEventListener('change', function() {
    const userId = Number(this.value)
    store.dispatch({
      type: 'FILTER_POSTS_BY_USER_ID',
      payload: { userId },
    })
  })
}

const initialState = {
  posts: POSTS,
}

const reducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case 'FETCH_ALL_POSTS':
      return { ...state, posts: POSTS }
    case 'FILTER_POSTS_BY_USER_ID':
      const filteredPosts = POSTS.filter(post => post.userId === action.payload!.userId)
      return { ...state, posts: filteredPosts }
    default:
      return state
  }
}

const store = Redux.createStore(reducer)
const list = document.querySelector<HTMLUListElement>('#post-list')

function render() {
  if (!list) return

  const state = store.getState()
  list.innerHTML = ''
  state.posts.forEach(post => {
    const li = document.createElement('li')
    li.textContent = post.title
    list.appendChild(li)
  })
}

store.subscribe(render)

const init = async () => {
  const posts = await fetchPosts()

  setUserIds(posts)

  store.dispatch({
    type: 'FETCH_ALL_POSTS',
  })
}

export {
  init,
}
