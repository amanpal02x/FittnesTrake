import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { counts } from "../utils/data";
import CountsCard from "../components/cards/CountsCard";
import WeeklyStatCard from "../components/cards/WeeklyStatCard";
import CategoryChart from "../components/cards/CategoryChart";
import AddWorkout from "../components/AddWorkout";
import WorkoutCard from "../components/cards/WorkoutCard";
import { addWorkout, getDashboardDetails, getWorkouts } from "../api";

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
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;
const Title = styled.div`
  padding: 0px 16px;
  font-size: 22px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
`;
const FlexWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 22px;
  padding: 0px 16px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;
const Section = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 16px;
  gap: 22px;
  padding: 0px 16px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;
const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-bottom: 100px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;

const Dashboard = () => {
  const [data, setData] = useState();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [todaysWorkouts, setTodaysWorkouts] = useState([]);
  const [workout, setWorkout] = useState(`#Legs
-Back Squat
-5 setsX15 reps
-30 kg
-10 min`);

  const dashboardData = async () => {
    const token = localStorage.getItem("fittrack-app-token");
    try {
      const res = await getDashboardDetails(token);
      setData(res.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  const getTodaysWorkout = async () => {
    const token = localStorage.getItem("fittrack-app-token");
    try {
      const res = await getWorkouts(token, "");
      setTodaysWorkouts(res?.data?.todaysWorkouts || []);
    } catch (err) {
      console.error("Error fetching today's workouts:", err);
    }
  };

  const validateWorkoutFormat = (workoutString) => {
    const lines = workoutString.trim().split('\n');
    if (lines.length < 5) return false;
    if (!lines[0].startsWith('#')) return false;
    return true;
  };

  const isDuplicateWorkout = (newWorkout) => {
    try {
      // Ensure newWorkout is not null/undefined and is a string
      if (!newWorkout || typeof newWorkout !== 'string') {
        return false;
      }

      const lines = newWorkout.trim().split('\n').filter(line => line.trim() !== '');
      if (lines.length < 2) return false;

      const category = lines[0].startsWith('#') ? lines[0].substring(1).trim() : lines[0].trim();
      const workoutName = lines[1].startsWith('-') ? lines[1].substring(1).trim() : lines[1].trim();

      // Ensure todaysWorkouts is an array and has items
      if (!Array.isArray(todaysWorkouts) || todaysWorkouts.length === 0) {
        return false;
      }

      return todaysWorkouts.some(workout => {
        if (!workout || typeof workout !== 'object') return false;
        
        const existingCategory = workout.category ? workout.category.trim() : '';
        const existingName = workout.name ? workout.name.trim() : '';
        
        return existingCategory === category && existingName === workoutName;
      });
    } catch (error) {
      console.error('Error checking for duplicate workout:', error);
      return false;
    }
  };

  const addNewWorkout = async () => {
    try {
      setButtonLoading(true);
      const token = localStorage.getItem("fittrack-app-token");
      if (!token) {
        alert("Please login again");
        return;
      }

      if (!validateWorkoutFormat(workout)) {
        alert("Please follow the correct format:\n#Category\n-Workout Name\n-Sets\n-Reps\n-Weight\n-Duration");
        return;
      }

      // Check for duplicate workout before sending to server
      if (isDuplicateWorkout(workout)) {
        alert("This workout already exists for today. Please add a different workout or modify the existing one.");
        return;
      }

      console.log('Sending workout data:', { workoutString: workout });
      const response = await addWorkout(token, { workoutString: workout });
      console.log('Workout response:', response);
      
      if (response?.data) {
        alert("Workout added successfully!");
        setWorkout(""); // Reset the input
        await Promise.all([dashboardData(), getTodaysWorkout()]).catch(err => {
          console.error("Error refreshing data:", err);
        });
      }
    } catch (err) {
      console.error("Error adding workout:", err);
      if (err.response?.data?.message?.includes('duplicate')) {
        alert("This workout already exists for today. Please add a different workout or modify the existing one.");
      } else if (err.message.includes('Network error')) {
        alert("Cannot connect to the server. Please check if:\n1. The server is running on port 8080\n2. You have an internet connection");
      } else {
        alert(err.message || "Error adding workout. Please try again.");
      }
    } finally {
      setButtonLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = localStorage.getItem("fittrack-app-token");
        if (!token) {
          console.error("No token found");
          return;
        }
        await Promise.all([dashboardData(), getTodaysWorkout()]);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        if (err.message.includes('Network error')) {
          alert("Cannot connect to the server. Please check if the server is running.");
        }
      }
    };
    fetchInitialData();
  }, []);

  return (
    <Container>
      <Wrapper>
        <Title>Dashboard</Title>
        <FlexWrap>
          {counts.map((item, index) => (
            <CountsCard key={index} item={item} data={data} />
          ))}
        </FlexWrap>

        <FlexWrap>
          <WeeklyStatCard data={data} />
          <CategoryChart data={data} />
          <AddWorkout
            workout={workout}
            setWorkout={setWorkout}
            addNewWorkout={addNewWorkout}
            buttonLoading={buttonLoading}
          />
        </FlexWrap>

        <Section>
          <Title>Todays Workouts</Title>
          <CardWrapper>
            {todaysWorkouts.map((workout, index) => (
              <WorkoutCard key={index} workout={workout} />
            ))}
          </CardWrapper>
        </Section>
      </Wrapper>
    </Container>
  );
};

export default Dashboard;
