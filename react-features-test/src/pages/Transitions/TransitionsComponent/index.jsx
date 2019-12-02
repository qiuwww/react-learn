import React, { useState, useTransition, Suspense } from 'react';

import './styles.css';
import { fetchProfileData } from './fakeApi';

function getNextId(id) {
  return id === 3 ? 0 : id + 1;
}

const initialResource = fetchProfileData(0);

export default function TransitionsComponent() {
  const [resource, setResource] = useState(initialResource);
  // useTransition现在还不可用
  console.log('useTransition', useTransition);
  if (!useTransition) {
    return `useTransition现在还不可用，当前版本: ${React.version}`;
  } else {
    const [startTransition, isPending] = useTransition({
      timeoutMs: 3000,
    });
    return (
      <>
        <button
          onClick={() => {
            startTransition(() => {
              const nextUserId = getNextId(resource.userId);
              setResource(fetchProfileData(nextUserId));
            });
          }}
        >
          Next
        </button>
        <ProfilePage resource={resource} />
      </>
    );
  }
}

function ProfilePage({ resource }) {
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
    </Suspense>
  );
}

function ProfileDetails({ resource }) {
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

function ProfileTimeline({ resource }) {
  const posts = resource.posts.read();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
