import React from "react";
import PropTypes from "prop-types";
// mui components
import Divider from "@material-ui/core/Divider";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
// mui styles
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  paper_root: {
    minWidth: 260,
    margin: theme.spacing(1, "auto"),
  },
  dialog_title: {
    display: "block",
    padding: theme.spacing(2),
  },
  dialog_content: {
    padding: theme.spacing(1, 2),
    marginTop: theme.spacing(2),
  },
  dialog_actions: {
    width: "100%",
    display: "block",
    padding: theme.spacing(1),
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DialogSlide = ({ open, handleClose, title, content, actions }) => {
  const classes = useStyles();

  return (
    <Dialog
      classes={{ paper: classes.paper_root }}
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      scroll="body"
      keepMounted
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle
        disableTypography
        id="alert-dialog-slide-title"
        classes={{ root: classes.dialog_title }}
      >
        {title}
      </DialogTitle>
      <Divider />
      <DialogContent classes={{ root: classes.dialog_content }}>
        {content}
      </DialogContent>
      <Divider />
      <DialogActions classes={{ root: classes.dialog_actions }}>
        {actions}
      </DialogActions>
    </Dialog>
  );
};

DialogSlide.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  title: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType]),
  content: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType]),
  actions: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType]),
};

export default DialogSlide;
