import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import "./Style.css";
import { DialogContent, DialogTitle } from "@mui/material";


const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function CustomDialog(props: any) {
  const { setShowDialog , showdialog } = props;
  const handleClose = () => {
    setShowDialog(false);
  };

  return (
    <Dialog
      open={showdialog}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      maxWidth="sm"
      fullWidth={true}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle className="custom-dialog__title">{props.dialogTitle}</DialogTitle>
      <DialogContent className="custom-dialog__content">{props.children}</DialogContent>
      <DialogActions className="custom-dialog__actions">
        {props.dialogActions}
      </DialogActions>
    </Dialog>
  );
}
