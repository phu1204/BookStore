import React, { useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../actions/orderActions";
import { openSnackbar } from "../actions/snackbarActions";
import {
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Breadcrumbs,
  Link,
  Divider,
  ListItemText,
  ListItem,
  List,
  ListItemIcon,
  Avatar,
  Box,
  Hidden,
  ListItemAvatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { GrLocation, GrCreditCard, GrProjects } from "react-icons/gr";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Message from "../components/Message";
import CheckoutSteps from "../components/CheckoutSteps";
import Meta from "../components/Meta";
import paypalImage from "../assets/images/paypal.png";

const useStyles = makeStyles((theme) => ({
  breadcrumbsContainer: {
    ...theme.mixins.customize.breadcrumbs,
  },
  content: {
    padding: 24,
    boxShadow: "0 10px 31px 0 rgba(0,0,0,0.05)",
    [theme.breakpoints.down("sm")]: {
      padding: 32,
    },
  },
  form: {
    marginTop: 16,
    "& > *": {
      marginBottom: 16,
    },
  },
  banner: {
    width: "100%",
    height: 380,
  },
  orderItems: {
    flexWrap: "wrap",
    paddingRight: 0,
  },
  items: {
    flexBasis: "100%",
    marginLeft: 56,
    [theme.breakpoints.down("xs")]: {
      marginLeft: 0,
    },
    "& .MuiTableCell-root": {
      paddingLeft: 0,
    },
    "& .MuiTableCell-head": {
      color: "rgba(0, 0, 0, 0.54)",
      fontWeight: 400,
    },
  },
  largeImage: {
    width: theme.spacing(6),
    height: theme.spacing(8),
  },
  empty: {
    ...theme.mixins.customize.centerFlex("column wrap"),
    marginTop: 30,
  },
  cartTotalWrapper: {
    marginTop: 22,
    padding: 20,
    fontSize: 16,
    backgroundColor: "#F4F4F4",
  },
  cartTotal: {
    fontSize: 18,
    marginBottom: 8,
    "&:nth-child(2)": {
      color: theme.palette.secondary.main,
    },
  },
  divider: {
    margin: "8px 0",
    width: 80,
    height: 2,
    backgroundColor: "#2a2a2a",
  },
  itemName: {
    ...theme.mixins.customize.textClamp(2),
  },
}));

const PlaceOrderScreen = ({ history }) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const cart = useSelector((state) => state.cart);

  if (!cart.shippingAddress.address) {
    history.push("/shipping");
  } else if (!cart.paymentMethod) {
    history.push("/payment");
  }
  //   Calculate prices
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  const address = Object.values(cart.shippingAddress).join(", ");

  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.priceSale * item.qty, 0)
  );
  cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100);
  
  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice)
  ).toFixed(2);

  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, error } = orderCreate;
  const { userInfo } = useSelector((state) => state.userLogin);

  useEffect(() => {
    if (success) {
      history.push(`/order/${order._id}`);
      dispatch(openSnackbar("Order has been created successfully", "success"));
    }
    if (!userInfo) {
      history.push(`/login?redirect=placeorder`);
    }
    // eslint-disable-next-line
  }, [history, success]);

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        totalPrice: cart.totalPrice,
      })
    );
  };

  return (
    <Container maxWidth="xl" style={{ marginBottom: 48 }}>
      <Meta title="Place Order | FashionShop" />
      <Grid container className={classes.breadcrumbsContainer}>
        <Grid item xs={12}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            style={{ marginBottom: 24 }}
          >
            <Link color="inherit" component={RouterLink} to="/">
              Trang ch???
            </Link>
            <Link color="textPrimary" component={RouterLink} to="/payment">
              ?????t h??ng
            </Link>
          </Breadcrumbs>
          <CheckoutSteps step={3} />
        </Grid>
      </Grid>
      <Paper elevation={0} className={classes.content}>
        <Grid container spacing={8}>
          <Grid item xs={12} lg={8}>
            <List>
              <ListItem divider>
                <ListItemIcon>
                  <GrLocation fontSize={22} />
                </ListItemIcon>
                <ListItemText
                  primary="?????a ??i???m giao h??ng"
                  secondary={address}
                />
              </ListItem>
              <ListItem divider>
                <ListItemIcon>
                  <GrCreditCard fontSize={22} />
                </ListItemIcon>
                <ListItemText
                  primary="Ph????ng th???c thanh to??n"
                  secondary={cart.paymentMethod}
                />
                {cart.paymentMethod == "Paypal" ? (
                  <ListItemAvatar>
                    <img src={paypalImage} alt="" width="80px" height="30px" />
                  </ListItemAvatar>
                ) : (
                  <ListItemAvatar></ListItemAvatar>
                )}
              </ListItem>
              <ListItem className={classes.orderItems}>
                <ListItemIcon>
                  <GrProjects fontSize={22} />
                </ListItemIcon>
                <ListItemText primary="????n h??ng" />
                {cart.cartItems.length > 0 ? (
                  <div className={classes.items}>
                    <TableContainer component={Paper} elevation={0}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>S???n ph???m</TableCell>
                            <Hidden smDown>
                              <TableCell align="right">Gi??</TableCell>
                            </Hidden>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {cart.cartItems.map((item) => (
                            <TableRow key={item.name}>
                              <TableCell component="th" scope="item">
                                <ListItem disableGutters>
                                  <ListItemAvatar>
                                    <Avatar
                                      variant="square"
                                      src={item.images && item.images[0]}
                                      alt="product image"
                                      className={classes.largeImage}
                                    ></Avatar>
                                  </ListItemAvatar>
                                  <ListItemText
                                    primary={item.name}
                                    className={classes.itemName}
                                    style={{ marginLeft: 16 }}
                                  />
                                </ListItem>
                                <Hidden mdUp>
                                  <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    mt={2}
                                  >
                                    <Box textAlign="center">
                                      {`${item.qty} x ${new Intl.NumberFormat(
                                        "de-DE",
                                        { style: "currency", currency: "VND" }
                                      ).format(
                                        item.priceSale
                                      )} = ${new Intl.NumberFormat("de-DE", {
                                        style: "currency",
                                        currency: "VND",
                                      }).format(item.qty * item.priceSale)}`}
                                    </Box>
                                  </Box>
                                </Hidden>
                              </TableCell>
                              <Hidden smDown>
                                <TableCell align="right">
                                  {`${item.qty} x ${new Intl.NumberFormat(
                                    "de-DE",
                                    { style: "currency", currency: "VND" }
                                  ).format(
                                    item.priceSale
                                  )} = ${new Intl.NumberFormat("de-DE", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(item.qty * item.priceSale)}`}
                                </TableCell>
                              </Hidden>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                ) : (
                  <div className={classes.empty}>
                    <Typography variant="subtitle1" color="secondary">
                      Gi??? h??ng ??ang tr???ng.{" "}
                      <Link to="/" component={RouterLink} color="primary">
                        Mua h??ng ngay!
                      </Link>
                    </Typography>
                  </div>
                )}
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Paper elevation={0} className={classes.cartTotalWrapper}>
              <Typography variant="h4" style={{ fontSize: 23 }}>
                T???ng ????n h??ng
              </Typography>
              <Divider className={classes.divider} />
              <List style={{ padding: "10px 20px 20px" }}>
                <ListItem divider disableGutters>
                  <ListItemText primary="S???n ph???m:" />
                  <Typography>
                    {new Intl.NumberFormat("de-DE", {
                      style: "currency",
                      currency: "VND",
                    }).format(cart.itemsPrice)}
                  </Typography>
                </ListItem>
                <ListItem divider disableGutters>
                  <ListItemText primary="Ph?? giao h??ng:" />
                  <Typography>
                    {new Intl.NumberFormat("de-DE", {
                      style: "currency",
                      currency: "VND",
                    }).format(cart.shippingPrice)}
                  </Typography>
                </ListItem>
                
                <ListItem disableGutters>
                  <ListItemText primary="T???ng c???ng:" />
                  <Typography color="secondary">
                    {new Intl.NumberFormat("de-DE", {
                      style: "currency",
                      currency: "VND",
                    }).format(cart.totalPrice)}
                  </Typography>
                </ListItem>
              </List>
              {error && <Message mb={16}>{error}</Message>}
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                disabled={cart.cartItems.length === 0}
                onClick={placeOrderHandler}
              >
                ?????t h??ng
              </Button>
              <Button
                variant="contained"
                component={RouterLink}
                to="/payment"
                fullWidth
                style={{ marginTop: 16 }}
              >
                Tr??? l???i
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default PlaceOrderScreen;
