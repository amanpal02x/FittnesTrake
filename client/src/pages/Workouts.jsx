import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { getWorkouts, updateWorkout, deleteWorkout } from "../api";
import { CircularProgress, Box, Snackbar, Alert, Backdrop } from "@mui/material";
import dayjs from 'dayjs';
import WorkoutList from "../components/WorkoutList";

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
  max-width: 1600px;
  display: flex;
  gap: 22px;
  padding: 0px 16px;
  @media (max-width: 600px) {
    gap: 12px;
    flex-direction: column;
  }
`;

const Left = styled.div`
  flex: 0.2;
  height: fit-content;
  padding: 18px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 14px;
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.primary + 15};
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.primary};
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const Right = styled.div`
  flex: 1;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 0px 16px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;

const SecTitle = styled.div`
  font-size: 22px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
`;

const LoadingContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  width: 100%;
`;

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [date, setDate] = useState(dayjs());
  const [error, setError] = useState({ open: false, message: '', severity: 'error' });
  const [workoutBeforeEdit, setWorkoutBeforeEdit] = useState(null);

  const handleErrorClose = () => {
    setError({ ...error, open: false });
  };

  const showNotification = (message, severity = 'success') => {
    setError({
      open: true,
      message,
      severity
    });
  };

  const fetchWorkouts = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("fittrack-app-token");
    try {
      const formattedDate = date ? `${date.month() + 1}/${date.date()}/${date.year()}` : "";
      const res = await getWorkouts(token, formattedDate ? `?date=${formattedDate}` : "");
      const workoutsWithIds = (res?.data?.todaysWorkouts || []).map((workout, index) => ({
        ...workout,
        id: workout.id || `temp-${index}`
      }));
      setWorkouts(workoutsWithIds);
    } catch (error) {
      console.error("Error fetching workouts:", error);
      showNotification(error.message || 'Failed to fetch workouts', 'error');
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const handleEditWorkout = async (id, editedWorkout) => {
    const token = localStorage.getItem("fittrack-app-token");
    setActionLoading(true);
    
    // Store the current state of the workout before edit
    const workoutToEdit = workouts.find(w => w.id === id);
    setWorkoutBeforeEdit(workoutToEdit);

    try {
      // Optimistically update UI
      setWorkouts(prevWorkouts => 
        prevWorkouts.map(workout => 
          workout.id === id ? { ...editedWorkout, id } : workout
        )
      );

      await updateWorkout(token, id, editedWorkout);
      showNotification('Workout updated successfully!');
      setWorkoutBeforeEdit(null);
    } catch (error) {
      console.error("Error updating workout:", error);
      
      // Revert to previous state
      if (workoutBeforeEdit) {
        setWorkouts(prevWorkouts => 
          prevWorkouts.map(workout => 
            workout.id === id ? workoutBeforeEdit : workout
          )
        );
      }
      
      showNotification(error.message || 'Failed to update workout', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteWorkout = async (id) => {
    const token = localStorage.getItem("fittrack-app-token");
    setActionLoading(true);
    
    // Store the workout before deletion for potential recovery
    const workoutToDelete = workouts.find(w => w.id === id);
    setWorkoutBeforeEdit(workoutToDelete);

    try {
      // Optimistically update UI
      setWorkouts(prevWorkouts => prevWorkouts.filter(workout => workout.id !== id));

      await deleteWorkout(token, id);
      showNotification('Workout deleted successfully!');
      setWorkoutBeforeEdit(null);
    } catch (error) {
      console.error("Error deleting workout:", error);
      
      // Restore the deleted workout
      if (workoutBeforeEdit) {
        setWorkouts(prevWorkouts => [...prevWorkouts, workoutBeforeEdit]);
      }
      
      showNotification(error.message || 'Failed to delete workout', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Container>
      <Wrapper>
        <Left>
          <Title>Select Date</Title>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              value={date}
              onChange={handleDateChange}
              sx={{
                '& .MuiPickersDay-root': {
                  color: 'text.primary',
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>
        </Left>
        <Right>
          <Section>
            <SecTitle>
              {date.format('MMMM D, YYYY')} Workouts
            </SecTitle>
            {loading ? (
              <LoadingContainer>
                <CircularProgress color="primary" />
              </LoadingContainer>
            ) : (
              workouts.length > 0 ? (
                <WorkoutList
                  workouts={workouts}
                  onEditWorkout={handleEditWorkout}
                  onDeleteWorkout={handleDeleteWorkout}
                  isLoading={actionLoading}
                />
              ) : (
                <Box sx={{ color: 'text.secondary', py: 4, textAlign: 'center' }}>
                  No workouts found for this date
                </Box>
              )
            )}
          </Section>
        </Right>
      </Wrapper>

      <Snackbar
        open={error.open}
        autoHideDuration={4000}
        onClose={handleErrorClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleErrorClose} 
          severity={error.severity}
          sx={{ 
            width: '100%',
            borderRadius: '12px',
            '& .MuiAlert-icon': {
              fontSize: '24px'
            }
          }}
        >
          {error.message}
        </Alert>
      </Snackbar>

      <Backdrop
        sx={{ 
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(0, 0, 0, 0.6)'
        }}
        open={actionLoading}
      >
        <CircularProgress color="primary" />
      </Backdrop>
    </Container>
  );
};

export default Workouts;
