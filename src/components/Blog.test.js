import React from 'react';

import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import { prettyDOM } from '@testing-library/dom';
import Blog from './Blog';

test('renders content', () => {
  const blog = {
    title: 'comp testing is done with react-testing-library',
    author: 'Tim Smith',
    url: 'http://testing.ca',
    likes: 2,
  };

  const component = render(<Blog blog={blog} />);

  //component.debug();

  // const d = component.container.querySelector('div');
  //console.log(prettyDOM(d));

  expect(component.container.querySelector('.title')).toHaveTextContent(
    'comp testing is done with react-testing-library'
  );
  expect(component.container).not.toHaveTextContent('http://testing.ca');
});

test('clicking the view/hide button shows more info and hides when clicked again', () => {
  const blog = {
    title: 'comp testing is done with react-testing-library',
    author: 'Tim Smith',
    url: 'http://testing.ca',
    likes: 2,
  };

  const component = render(<Blog blog={blog} />);

  const viewButton = component.getByText('view');
  fireEvent.click(viewButton);
  expect(component.container.querySelector('.url')).toHaveTextContent('http://testing.ca');
  const hideButton = component.getByText('hide');
  fireEvent.click(hideButton);
  expect(component.container.querySelector('.url')).toBeNull();
  //const buttonLike = component.getByText('like');
  //fireEvent.click(buttonLike);
  //expect(mockHandler.mock.calls).toHaveLength(1);
});

test('clicking the like button twice', () => {
  const blog = {
    title: 'comp testing is done with react-testing-library',
    author: 'Tim Smith',
    url: 'http://testing.ca',
    likes: 2,
  };
  const mockHandler = jest.fn();

  const component = render(<Blog blog={blog} increaseBlogLike={mockHandler} />);

  const viewButton = component.getByText('view');
  fireEvent.click(viewButton);
  const buttonLike = component.getByText('like');
  fireEvent.click(buttonLike);
  fireEvent.click(buttonLike);
  expect(mockHandler.mock.calls).toHaveLength(2);
});
