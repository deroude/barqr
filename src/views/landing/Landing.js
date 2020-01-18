import React, { Component } from "react";
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { CardMedia, Card, CardHeader, CardContent } from "@material-ui/core";
import QrReader from 'react-qr-reader';

const tablePattern = /^\/venues\/([a-zA-Z0-9]+)\/tables\/([a-zA-Z0-9]+)$/

const styles = theme => ({
    card: {
        minWidth: 275,
        maxWidth: 800,
        width: '100%'
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

    state = { text: "Please scan the QR code on your table", venue: null, table: null };

    readQR(data) {
        if (data && tablePattern.test(data)) {
            const params = tablePattern.exec(data);
            this.setState({ text: data, venue: params[1], table: params[2] });
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <Card className={classes.card} variant="outlined">
                <CardHeader
                    title="Welcome to Club QR"
                />
                <CardMedia>
                    <QrReader
                        delay={300}
                        onError={err => console.log(err)}
                        onScan={this.readQR.bind(this)}
                        style={{ width: '100%' }}
                    />
                </CardMedia>
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {this.state.text}
                    </Typography>
                    {this.state.venue && this.state.table &&
                        <Redirect push to={`/consumer/${this.state.venue}/${this.state.table}`} />
                    }
                </CardContent>
            </Card>
        );
    }
}

Landing.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Landing);