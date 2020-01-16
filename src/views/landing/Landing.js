import React, { Component } from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { CardMedia, Card, CardHeader, CardContent } from "@material-ui/core";
import QrReader from 'react-qr-reader';

const styles = theme => ({
    card: {
        minWidth: 275,
        maxWidth: 800,
        width:'100%'
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

class Landing extends Component {

    state = { text: "Please scan the QR code on your table" };

    render() {
        const { classes } = this.props;
        return (
            <Card className={classes.card} variant="outlined">
                <CardHeader
                    title="Welcome to Bar QR"
                />
                <CardMedia>
                    <QrReader
                        delay={300}
                        onError={err => console.log(err)}
                        onScan={data => { if (data) { this.setState({ text: data }); console.log(data); } }}
                        style={{ width: '100%' }}
                    />
                </CardMedia>
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {this.state.text}
                    </Typography>
                </CardContent>
            </Card>
        );
    }
}

Landing.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(Landing);