import React from "react";
import { Card, CardContent, CardActions, Button, Avatar, Typography } from "@mui/material";

const ProfileCard: React.FC = () => {
  return (
    <Card className="max-w-sm mx-auto mt-10 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardContent className="flex flex-col items-center text-center">
        <Avatar
          alt="Jane Doe"
          src="https://i.pravatar.cc/150?img=12"
          className="w-24 h-24 mb-4"
        />
        <p className="text-gray-500 mb-5">Frontend Developer</p>
        {/* Use Tailwind + MUI typography tokens */}
        <Typography className="typography-h1 text-primary mb-2" component="h2">
          Jane Doe
        </Typography>
        <Typography className="typography-body1 text-gray-700" component="p" align="center">
          Frontend Developer passionate about React, MUI, and Tailwind CSS integration.
        </Typography>
      </CardContent>
      <CardActions className="justify-center">
        <Button variant="contained" color="primary" className="px-6 py-2 rounded-md">
          Follow
        </Button>
        <Button variant="outlined" color="primary" className="ml-4 px-6 py-2 rounded-md">
          Message
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProfileCard;
