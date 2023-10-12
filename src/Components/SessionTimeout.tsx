import React, { useEffect, useState, useContext } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Typography } from '@mui/material';
import AuthContext, { IAuthContext } from '../Context/AuthProvider';

interface SessionTimeoutProps {}

const SessionTimeout: React.FC<SessionTimeoutProps> = () => {
  const { signOut, isAuthenticated } = useContext<IAuthContext>(AuthContext);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(300); // 5 minutes in seconds
  const [idleTimeoutPassed, setIdleTimeoutPassed] = useState<boolean>(false);

  useEffect(() => {
    let activityTimer: NodeJS.Timeout;
    let countdownTimer: NodeJS.Timeout;

    const startTimers = () => {
      // Start the countdown
      countdownTimer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 0) {
            // Auto logout after countdown expires
            // signOut();
            clearInterval(countdownTimer);
            return 0;
          } else {
            return prev - 1;
          }
        });
      }, 1000);
    };

    const resetTimers = () => {
      clearInterval(countdownTimer);
      setCountdown(300);
      startTimers();
    };

    const handleActivity = () => {
      // Check if the initial idle timeout has passed
      if (!idleTimeoutPassed) {
        setIdleTimeoutPassed(true);
        resetTimers();
      }
    };

    if (isAuthenticated) {
      // Initial idle timeout of 5 seconds
      activityTimer = setTimeout(() => {
        setShowModal(true);
        startTimers();
      }, 5000);

      // Attach event listeners for user activity
      window.addEventListener('mousemove', handleActivity);
      window.addEventListener('keydown', handleActivity);
    }

    return () => {
      clearTimeout(activityTimer);
      clearInterval(countdownTimer);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, [isAuthenticated, signOut, idleTimeoutPassed]);

  const handleCloseModal = () => {
    setShowModal(false);
    setCountdown(300); // Reset the countdown
  };

  return (
    <Dialog open={showModal}>
      <DialogTitle>{"Session Idle"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Session will expire in {Math.floor(countdown / 60)} minutes and {countdown % 60} seconds.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModal} color="primary">
          <Typography>Keep me logged in</Typography>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionTimeout;
