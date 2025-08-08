import { http, HttpResponse } from 'msw';
import { mockData } from '@/lib/mockData';

export const handlers = [
  // Restaurants API
  http.get('/api/restaurants', () => {
    return HttpResponse.json(mockData.restaurants);
  }),

  http.get('/api/restaurants/:id', ({ params }) => {
    const restaurant = mockData.restaurants.find(r => r.id === params.id);
    if (!restaurant) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(restaurant);
  }),

  // Blog posts API
  http.get('/api/blog', () => {
    return HttpResponse.json(mockData.blogPosts);
  }),

  http.get('/api/blog/:id', ({ params }) => {
    const post = mockData.blogPosts.find(p => p.id === params.id);
    if (!post) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(post);
  }),

  // Reviews API
  http.get('/api/restaurants/:id/reviews', () => {
    return HttpResponse.json([]);
  }),

  http.post('/api/restaurants/:id/reviews', async ({ request }) => {
    const review = (await request.json()) as any;
    return HttpResponse.json({
      id: Date.now().toString(),
      ...review,
      created_at: new Date().toISOString(),
    });
  }),

  // Comments API
  http.get('/api/blog/:id/comments', () => {
    return HttpResponse.json([]);
  }),

  http.post('/api/blog/:id/comments', async ({ request }) => {
    const comment = (await request.json()) as any;
    return HttpResponse.json({
      id: Date.now().toString(),
      ...comment,
      created_at: new Date().toISOString(),
    });
  }),

  // Auth API
  http.post('/api/auth/signin', async ({ request }) => {
    const { email, password } = (await request.json()) as any;

    // Mock authentication
    if (email === 'test@example.com' && password === 'password') {
      return HttpResponse.json({
        user: {
          id: '1',
          email: 'test@example.com',
          user_metadata: {
            full_name: 'Test User',
          },
        },
        session: {
          access_token: 'mock-token',
          refresh_token: 'mock-refresh-token',
        },
      });
    }

    return new HttpResponse(null, { status: 401 });
  }),

  http.post('/api/auth/signup', async ({ request }) => {
    const { email } = (await request.json()) as any;

    return HttpResponse.json({
      user: {
        id: Date.now().toString(),
        email,
        user_metadata: {
          full_name: email.split('@')[0],
        },
      },
      session: {
        access_token: 'mock-token',
        refresh_token: 'mock-refresh-token',
      },
    });
  }),

  http.post('/api/auth/signout', () => {
    return HttpResponse.json({ success: true });
  }),
];
