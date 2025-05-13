import React, { useState } from 'react';
import styled from "styled-components";
import { Card, CardContent, CardMedia, Typography, Chip, IconButton, TextField, InputAdornment } from '@mui/material';
import { Search, Favorite, Share, BookmarkBorder } from '@mui/icons-material';

const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 22px 0px;
  overflow-y: scroll;
`;

const Wrapper = styled.div`
  flex: 1;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Title = styled.h1`
  font-size: 32px;
  color: ${({ theme }) => theme.text_primary};
`;

const SearchBar = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  padding: 20px 0;
`;

const BlogCard = styled(Card)`
  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: translateY(-5px);
  }
`;

const TagsContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 12px 0;
`;

const CardActions = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 16px 16px;
`;

const blogPosts = [
  {
    id: 1,
    title: "10 Essential Exercises for Building Core Strength",
    excerpt: "Discover the most effective exercises to develop a strong and stable core...",
    image: "https://source.unsplash.com/random/400x250/?fitness-core",
    tags: ["Core Training", "Strength", "Workout"],
    date: "March 15, 2024",
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "The Ultimate Guide to Post-Workout Nutrition",
    excerpt: "Learn what to eat after your workout to maximize recovery and results...",
    image: "https://source.unsplash.com/random/400x250/?healthy-food",
    tags: ["Nutrition", "Recovery", "Health"],
    date: "March 14, 2024",
    readTime: "7 min read"
  },
  {
    id: 3,
    title: "How to Create a Sustainable Workout Routine",
    excerpt: "Tips and strategies for developing a workout routine that you can stick to...",
    image: "https://source.unsplash.com/random/400x250/?gym-workout",
    tags: ["Fitness", "Lifestyle", "Planning"],
    date: "March 13, 2024",
    readTime: "6 min read"
  },
  {
    id: 4,
    title: "The Benefits of High-Intensity Interval Training (HIIT)",
    excerpt: "Explore why HIIT has become so popular and its numerous health benefits...",
    image: "https://source.unsplash.com/random/400x250/?hiit-workout",
    tags: ["HIIT", "Cardio", "Fat Loss"],
    date: "March 12, 2024",
    readTime: "4 min read"
  },
  {
    id: 5,
    title: "Mindfulness and Exercise: The Perfect Combination",
    excerpt: "Discover how combining mindfulness with your workouts can enhance results...",
    image: "https://source.unsplash.com/random/400x250/?meditation-fitness",
    tags: ["Mindfulness", "Wellness", "Mental Health"],
    date: "March 11, 2024",
    readTime: "5 min read"
  },
  {
    id: 6,
    title: "Beginner's Guide to Weight Training",
    excerpt: "Everything you need to know to start your weight training journey safely...",
    image: "https://source.unsplash.com/random/400x250/?weight-training",
    tags: ["Weight Training", "Beginners", "Strength"],
    date: "March 10, 2024",
    readTime: "8 min read"
  }
];

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Container>
      <Wrapper>
        <Header>
          <Title>Fitness Blog</Title>
          <SearchBar>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </SearchBar>
        </Header>

        <BlogGrid>
          {filteredPosts.map((post) => (
            <BlogCard key={post.id}>
              <CardMedia
                component="img"
                height="200"
                image={post.image}
                alt={post.title}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {post.date} • {post.readTime}
                </Typography>
                <Typography variant="body2" paragraph>
                  {post.excerpt}
                </Typography>
                <TagsContainer>
                  {post.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      variant="outlined"
                      clickable
                    />
                  ))}
                </TagsContainer>
              </CardContent>
              <CardActions>
                <div>
                  <IconButton size="small">
                    <Favorite />
                  </IconButton>
                  <IconButton size="small">
                    <Share />
                  </IconButton>
                </div>
                <IconButton size="small">
                  <BookmarkBorder />
                </IconButton>
              </CardActions>
            </BlogCard>
          ))}
        </BlogGrid>
      </Wrapper>
    </Container>
  );
};

export default Blog; 