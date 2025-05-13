import React, { useState } from 'react';
import styled from "styled-components";
import { 
  Paper, 
  IconButton, 
  Typography, 
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
  Fade,
  DialogContentText,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { 
  Edit, 
  Delete, 
  FitnessCenter, 
  AccessTime, 
  TrendingUp,
  Close,
  FormatListNumbered,
  RepeatOne
} from '@mui/icons-material';
import AddWorkout, { categoryConfig } from './AddWorkout';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 20px 0;
`;

const WorkoutCard = styled(Paper)`
  padding: 24px;
  border-radius: 20px !important;
  background: ${({ theme }) => theme.card};
  position: relative;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 28px rgba(0,0,0,0.15);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.categoryColor};
    border-radius: 20px 20px 0 0;
    opacity: 0.8;
  }
`;

const WorkoutHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Category = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 30px;
  background: ${props => props.color + '15'};
  color: ${props => props.color};
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.3px;
  border: 1px solid ${props => props.color + '30'};
`;

const WorkoutTitle = styled(Typography)`
  font-size: 24px !important;
  font-weight: 600 !important;
  color: ${({ theme }) => theme.text_primary};
  margin: 16px 0 !important;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const WorkoutDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-top: 20px;
  padding: 20px;
  background: ${({ theme }) => theme.bg + '50'};
  border-radius: 16px;
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: ${({ theme }) => theme.card};
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const DetailLabel = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.text_secondary};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const DetailValue = styled.span`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled(IconButton)`
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  padding: 8px !important;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    border-radius: 24px;
    padding: 8px;
    background: ${({ theme }) => theme.card};
  }
`;

const DialogHeader = styled(DialogTitle)`
  background: ${({ theme }) => theme.bg};
  border-radius: 16px;
  margin: 8px;
  padding: 16px !important;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  border-radius: inherit;
`;

const WorkoutList = ({ workouts, onEditWorkout, onDeleteWorkout, isLoading }) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleEditClick = (workout) => {
    if (isLoading) return;
    setSelectedWorkout(workout);
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setSelectedWorkout(null);
  };

  const handleEditSave = (editedWorkout) => {
    onEditWorkout(selectedWorkout.id, editedWorkout);
    handleEditClose();
    setSnackbar({
      open: true,
      message: 'Workout updated successfully!',
      severity: 'success'
    });
  };

  const handleDeleteClick = (workout) => {
    if (isLoading) return;
    setSelectedWorkout(workout);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    onDeleteWorkout(selectedWorkout.id);
    setDeleteDialogOpen(false);
    setSelectedWorkout(null);
    setSnackbar({
      open: true,
      message: 'Workout deleted successfully!',
      severity: 'success'
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container>
      {workouts.map((workout) => (
        <WorkoutCard 
          key={workout.id} 
          elevation={2}
          categoryColor={categoryConfig[workout.category]?.color}
        >
          <WorkoutHeader>
            <Category color={categoryConfig[workout.category]?.color}>
              {categoryConfig[workout.category]?.icon}
              {workout.category}
            </Category>
            <ActionButtons>
              <Tooltip 
                title={isLoading ? "Please wait..." : "Edit workout"}
                TransitionComponent={Fade} 
                TransitionProps={{ timeout: 300 }}
              >
                <ActionButton
                  onClick={() => handleEditClick(workout)}
                  size="small"
                  disabled={isLoading}
                  sx={{
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'rgba(0, 201, 255, 0.08)',
                    }
                  }}
                >
                  <Edit />
                  {isLoading && (
                    <LoadingOverlay>
                      <CircularProgress size={16} color="inherit" />
                    </LoadingOverlay>
                  )}
                </ActionButton>
              </Tooltip>
              <Tooltip 
                title={isLoading ? "Please wait..." : "Delete workout"}
                TransitionComponent={Fade} 
                TransitionProps={{ timeout: 300 }}
              >
                <ActionButton
                  onClick={() => handleDeleteClick(workout)}
                  size="small"
                  disabled={isLoading}
                  sx={{
                    '&:hover': {
                      color: 'error.main',
                      backgroundColor: 'rgba(255, 72, 66, 0.08)',
                    }
                  }}
                >
                  <Delete />
                  {isLoading && (
                    <LoadingOverlay>
                      <CircularProgress size={16} color="inherit" />
                    </LoadingOverlay>
                  )}
                </ActionButton>
              </Tooltip>
            </ActionButtons>
          </WorkoutHeader>

          <WorkoutTitle>
            <FitnessCenter sx={{ fontSize: 28, color: categoryConfig[workout.category]?.color }} />
            {workout.workoutName}
          </WorkoutTitle>

          <WorkoutDetails>
            <DetailItem>
              <DetailLabel>
                <FormatListNumbered fontSize="small" />
                Sets
              </DetailLabel>
              <DetailValue>{workout.sets}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>
                <RepeatOne fontSize="small" />
                Reps
              </DetailLabel>
              <DetailValue>{workout.reps}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>
                <TrendingUp fontSize="small" />
                Weight
              </DetailLabel>
              <DetailValue>{workout.weight} kg</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>
                <AccessTime fontSize="small" />
                Duration
              </DetailLabel>
              <DetailValue>{workout.duration} min</DetailValue>
            </DetailItem>
          </WorkoutDetails>
        </WorkoutCard>
      ))}

      {/* Edit Dialog */}
      <StyledDialog 
        open={editDialogOpen} 
        onClose={handleEditClose}
        maxWidth="md"
        fullWidth
      >
        <DialogHeader>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={1}>
              <FitnessCenter sx={{ color: categoryConfig[selectedWorkout?.category]?.color }} />
              <Typography variant="h6">Edit Workout</Typography>
            </Box>
            <IconButton onClick={handleEditClose} size="small" disabled={isLoading}>
              <Close />
            </IconButton>
          </Box>
        </DialogHeader>
        <DialogContent sx={{ p: 3 }}>
          {selectedWorkout && (
            <AddWorkout
              initialData={selectedWorkout}
              onSubmit={handleEditSave}
              buttonText="Save Changes"
              buttonLoading={isLoading}
            />
          )}
        </DialogContent>
      </StyledDialog>

      {/* Delete Confirmation Dialog */}
      <StyledDialog
        open={deleteDialogOpen}
        onClose={() => !isLoading && setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogHeader>
          <Box display="flex" alignItems="center" gap={1}>
            <Delete color="error" />
            <Typography variant="h6">Delete Workout</Typography>
          </Box>
        </DialogHeader>
        <DialogContent sx={{ p: 3 }}>
          <DialogContentText>
            Are you sure you want to delete "{selectedWorkout?.workoutName}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            disabled={isLoading}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              padding: '8px 24px'
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={isLoading}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              padding: '8px 24px',
              position: 'relative'
            }}
          >
            {isLoading && (
              <CircularProgress
                size={16}
                sx={{
                  position: 'absolute',
                  left: '50%',
                  marginLeft: '-8px'
                }}
              />
            )}
            <span style={{ visibility: isLoading ? 'hidden' : 'visible' }}>
              Delete
            </span>
          </Button>
        </DialogActions>
      </StyledDialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            borderRadius: '12px',
            '& .MuiAlert-icon': {
              fontSize: '24px'
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default WorkoutList; 