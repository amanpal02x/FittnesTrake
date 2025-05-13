import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import { TextField, Button, MenuItem, InputAdornment, CircularProgress, Paper, Autocomplete } from '@mui/material';
import { FitnessCenter, Timer, RepeatOne, FormatListNumbered, Add } from '@mui/icons-material';

const Container = styled(Paper)`
  max-width: 800px;
  margin: 20px auto;
  border-radius: 24px !important;
  overflow: hidden;
  background: ${({ theme }) => theme.card};
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(90deg, #00C9FF 0%, #92FE9D 100%);
  }
`;

const Card = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  
  @media (max-width: 600px) {
    padding: 20px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 24px;
  color: ${({ theme }) => theme.primary};
  letter-spacing: -0.5px;
`;

const Subtitle = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
  margin-bottom: 24px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormRow = styled.div`
  display: flex;
  gap: 20px;
  
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SectionTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 4px;
`;

const workoutCategories = [
  "Legs",
  "Chest",
  "Back",
  "Shoulders",
  "Arms",
  "Core",
  "Cardio",
  "Full Body",
  "Other"
];

const StyledMenuItem = styled(MenuItem)`
  padding: 12px 20px !important;
  margin: 4px 8px !important;
  border-radius: 8px !important;
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;
  
  &:hover {
    background: rgb(0, 201, 255, 1) !important;
    color: white !important;
  }
  
  &.Mui-selected {
    background: rgb(0, 201, 255, 1) !important;
    color: white !important;
    
    &:hover {
      background: rgb(0, 201, 255, 0.9) !important;
    }
  }
`;

const CategoryIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.color};
  color: white;
`;

export const categoryConfig = {
  "Legs": { color: "#FF6B6B", icon: "🦵" },
  "Chest": { color: "#4ECDC4", icon: "💪" },
  "Back": { color: "#45B7D1", icon: "🔙" },
  "Shoulders": { color: "#96CEB4", icon: "🏋️" },
  "Arms": { color: "#D4A5A5", icon: "💪" },
  "Core": { color: "#FFE66D", icon: "🎯" },
  "Cardio": { color: "#FF8C42", icon: "🏃" },
  "Full Body": { color: "#6C5B7B", icon: "⚡" },
  "Other": { color: "#C06C84", icon: "⭐" }
};

// Workout suggestions for each category
const workoutSuggestions = {
  "Legs": [
    "Back Squats",
    "Front Squats",
    "Romanian Deadlifts",
    "Leg Press",
    "Walking Lunges",
    "Calf Raises",
    "Bulgarian Split Squats",
    "Leg Extensions",
    "Hamstring Curls",
    "Box Jumps"
  ],
  "Chest": [
    "Bench Press",
    "Incline Bench Press",
    "Decline Bench Press",
    "Dumbbell Flyes",
    "Push-Ups",
    "Cable Flyes",
    "Dips",
    "Landmine Press",
    "Machine Chest Press",
    "Resistance Band Press"
  ],
  "Back": [
    "Deadlifts",
    "Pull-Ups",
    "Bent Over Rows",
    "Lat Pulldowns",
    "T-Bar Rows",
    "Face Pulls",
    "Single-Arm Rows",
    "Good Mornings",
    "Meadows Rows",
    "Seated Cable Rows"
  ],
  "Shoulders": [
    "Military Press",
    "Arnold Press",
    "Lateral Raises",
    "Front Raises",
    "Reverse Flyes",
    "Face Pulls",
    "Upright Rows",
    "Pike Push-Ups",
    "Shoulder Press",
    "Plate Raises"
  ],
  "Arms": [
    "Bicep Curls",
    "Tricep Extensions",
    "Hammer Curls",
    "Skull Crushers",
    "Preacher Curls",
    "Diamond Push-Ups",
    "Rope Pushdowns",
    "Concentration Curls",
    "Close-Grip Bench Press",
    "21s"
  ],
  "Core": [
    "Planks",
    "Russian Twists",
    "Leg Raises",
    "Crunches",
    "Dead Bug",
    "Bird Dog",
    "Ab Wheel Rollouts",
    "Mountain Climbers",
    "Side Planks",
    "Cable Woodchops"
  ],
  "Cardio": [
    "Running",
    "Cycling",
    "Jump Rope",
    "High Knees",
    "Burpees",
    "Mountain Climbers",
    "Rowing",
    "Stair Climber",
    "Elliptical",
    "Swimming"
  ],
  "Full Body": [
    "Burpees",
    "Turkish Get-Ups",
    "Clean and Press",
    "Thrusters",
    "Man Makers",
    "Devil Press",
    "Kettlebell Swings",
    "Mountain Climbers",
    "Bear Crawls",
    "Renegade Rows"
  ],
  "Other": [
    "Yoga Flow",
    "Pilates",
    "Mobility Work",
    "Foam Rolling",
    "Dynamic Stretching",
    "Balance Training",
    "Resistance Band Work",
    "Isometric Holds",
    "Active Recovery",
    "Flexibility Work"
  ]
};

const AddWorkout = ({ addNewWorkout, buttonLoading, initialData, onSubmit, buttonText = 'Add Workout' }) => {
  const [formData, setFormData] = useState({
    category: '',
    workoutName: '',
    sets: '',
    reps: '',
    weight: '',
    duration: ''
  });

  const [errors, setErrors] = useState({});
  const [workoutOptions, setWorkoutOptions] = useState([]);

  // Initialize form with initial data if provided (edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setWorkoutOptions(workoutSuggestions[initialData.category] || []);
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.workoutName) newErrors.workoutName = 'Workout name is required';
    if (!formData.sets || formData.sets < 1) newErrors.sets = 'Enter valid number of sets';
    if (!formData.reps || formData.reps < 1) newErrors.reps = 'Enter valid number of reps';
    if (!formData.weight || formData.weight < 0) newErrors.weight = 'Enter valid weight';
    if (!formData.duration || formData.duration < 1) newErrors.duration = 'Enter valid duration';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setFormData(prev => ({
      ...prev,
      category,
      workoutName: '' // Reset workout name when category changes
    }));
    setWorkoutOptions(workoutSuggestions[category] || []);
    
    if (errors.category) {
      setErrors(prev => ({
        ...prev,
        category: ''
      }));
    }
  };

  const handleWorkoutNameChange = (event, newValue) => {
    setFormData(prev => ({
      ...prev,
      workoutName: newValue || ''
    }));
    
    // Clear error when user types
    if (errors.workoutName) {
      setErrors(prev => ({
        ...prev,
        workoutName: ''
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (initialData) {
      // Edit mode
      onSubmit(formData);
    } else {
      // Add mode
      const workoutString = `#${formData.category}\n-${formData.workoutName}\n-${formData.sets} sets ${formData.reps} reps\n-${formData.weight} kg\n-${formData.duration} min`;
      addNewWorkout(workoutString);
      
      // Reset form after successful submission only in add mode
      setFormData({
        category: '',
        workoutName: '',
        sets: '',
        reps: '',
        weight: '',
        duration: ''
      });
    }
  };

  return (
    <Container elevation={3}>
      <Card>
        {!initialData && (
          <div>
            <Header>
              <FitnessCenter sx={{ fontSize: 28, color: 'primary.main' }} />
              <Title>Add New Workout</Title>
            </Header>
            <Subtitle>Track your progress by adding your workout details below</Subtitle>
          </div>
        )}
        
        <Form onSubmit={handleSubmit}>
          <FormSection>
            <SectionTitle>Workout Details</SectionTitle>
            <FormRow>
              <TextField
                select
                fullWidth
                name="category"
                label="Category"
                value={formData.category}
                onChange={handleCategoryChange}
                error={!!errors.category}
                helperText={errors.category}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FitnessCenter />
                    </InputAdornment>
                  ),
                }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        maxHeight: 400,
                        marginTop: '8px',
                        borderRadius: '16px',
                        padding: '8px',
                        backgroundColor: 'white',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                        '& .MuiList-root': {
                          padding: '4px',
                          backgroundColor: 'white',
                        },
                        '& .MuiMenuItem-root': {
                          backgroundColor: 'white',
                        }
                      },
                    },
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  },
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    backgroundColor: 'white',
                  },
                  '& .MuiPaper-root': {
                    backgroundColor: 'white',
                  }
                }}
              >
                {workoutCategories.map((category) => (
                  <StyledMenuItem key={category} value={category}>
                    <CategoryIcon color={categoryConfig[category].color}>
                      {categoryConfig[category].icon}
                    </CategoryIcon>
                    {category}
                  </StyledMenuItem>
                ))}
              </TextField>

              <Autocomplete
                fullWidth
                freeSolo
                value={formData.workoutName}
                onChange={handleWorkoutNameChange}
                onInputChange={(event, newInputValue) => {
                  handleWorkoutNameChange(event, newInputValue);
                }}
                options={workoutOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Workout Name"
                    error={!!errors.workoutName}
                    helperText={errors.workoutName}
                    placeholder={formData.category ? "Select or type workout name" : "Select category first"}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                      }
                    }}
                  />
                )}
                PaperComponent={({ children }) => (
                  <Paper
                    elevation={8}
                    sx={{
                      borderRadius: '16px',
                      marginTop: '8px',
                      padding: '8px',
                      backgroundColor: 'white',
                      '& .MuiAutocomplete-option': {
                        padding: '12px 20px',
                        margin: '4px 8px',
                        borderRadius: '8px',
                        '&:hover': {
                          backgroundColor: 'rgb(0, 201, 255, 1)',
                          color: 'white',
                        },
                        '&[aria-selected="true"]': {
                          backgroundColor: 'rgb(0, 201, 255, 1)',
                          color: 'white',
                        }
                      }
                    }}
                  >
                    {children}
                  </Paper>
                )}
              />
            </FormRow>
          </FormSection>

          <FormSection>
            <SectionTitle>Sets & Reps</SectionTitle>
            <FormRow>
              <TextField
                name="sets"
                label="Sets"
                type="number"
                value={formData.sets}
                onChange={handleChange}
                error={!!errors.sets}
                helperText={errors.sets}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FormatListNumbered />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  }
                }}
              />
              <TextField
                name="reps"
                label="Reps"
                type="number"
                value={formData.reps}
                onChange={handleChange}
                error={!!errors.reps}
                helperText={errors.reps}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <RepeatOne />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  }
                }}
              />
            </FormRow>
          </FormSection>

          <FormSection>
            <SectionTitle>Weight & Duration</SectionTitle>
            <FormRow>
              <TextField
                name="weight"
                label="Weight (kg)"
                type="number"
                value={formData.weight}
                onChange={handleChange}
                error={!!errors.weight}
                helperText={errors.weight}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FitnessCenter />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  }
                }}
              />
              <TextField
                name="duration"
                label="Duration (minutes)"
                type="number"
                value={formData.duration}
                onChange={handleChange}
                error={!!errors.duration}
                helperText={errors.duration}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Timer />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  }
                }}
              />
            </FormRow>
          </FormSection>

          <Button
            variant="contained"
            color="primary"
            size="large"
            type="submit"
            disabled={buttonLoading}
            startIcon={buttonLoading ? <CircularProgress size={20} color="inherit" /> : <Add />}
            sx={{
              height: '56px',
              borderRadius: '14px',
              fontSize: '16px',
              fontWeight: 600,
              textTransform: 'none',
              background: 'linear-gradient(90deg, #00C9FF 0%, #92FE9D 100%)',
              boxShadow: '0 4px 15px rgba(0, 201, 255, 0.2)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(0, 201, 255, 0.3)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            {buttonLoading ? 'Processing...' : buttonText}
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default AddWorkout;
