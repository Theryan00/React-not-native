import React from "react";
import MainTemplate from "../../components/templates/main.template";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import TabPanel from "../../components/organisms/TabPanel/TabPanel";
import { Bar } from "react-chartjs-2";
import { HorizontalBar } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    backgroundColor: theme.palette.secondary.main,
  },

  Tab: {
    root: theme.palette.primary.main,
  },
}));

const Dashboard = ({
  orders,
  nrOfOrder,
  menuItems,
  orderList,
  consumerList,
}) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  //totalSale
  var amountSold = [];
  var itemNames = [];
  var consumerIds = [];

  menuItems.forEach((item) => {
    amountSold.push({
      item: item.menuItemName,
      key: item.key,
      sold: "0",
      todaySold: "0",
    });
  });
  //console.log(amountSold);
  amountSold.forEach((item) => {
    orderList.forEach((order) => {
      var sold = Number(item.sold);
      if (!isNaN(order?.menuItems[item.key]?.quantity)) {
        sold += Number(order?.menuItems[item.key]?.quantity);
      }
      item.sold = "" + sold;
    });
  });
  var totalSale = [];
  amountSold.forEach((item) => {
    itemNames.push(item.item);
    totalSale.push(item.sold);
  });
  const sales = {
    labels: itemNames,
    datasets: [
      {
        backgroundColor: "rgba(213, 184, 255, 0.6)",
        data: totalSale,
      },
    ],
  };

  //today sales
  let today = new Date().toLocaleDateString();
  var todayEarn = 0;
  var todayOrder = 0;
  amountSold.forEach((item) => {
    orderList.forEach((order) => {
      var sold = Number(item.todaySold);
      if (!isNaN(order?.menuItems[item.key]?.quantity) && order.date == today) {
        sold += Number(order?.menuItems[item.key]?.quantity);
        todayEarn += order?.totalPrice;
        todayOrder++;
      }
      item.todaySold = "" + sold;
    });
  });
  var dailySale = [];
  amountSold.forEach((item) => {
    dailySale.push(item.todaySold);
  });
  const daily = {
    labels: itemNames,
    datasets: [
      {
        backgroundColor: "rgba(255,206,86,0.6)",
        data: dailySale,
      },
    ],
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //sale by months
  var recentMonths = [];
  var saleLastYear = 0;
  var orderLastYear = 0;
  const myear = today.split("/");
  for (var i = 11; i >= 0; i--) {
    if (i >= Number(myear[0])) {
      var my = Number(myear[0]) + i + "/" + (Number(myear[2]) - 1);
      recentMonths.push({ month: my, sold: "0" });
      if (i == Number(myear[0])) {
        recentMonths.reverse();
      }
    } else {
      var my = Number(myear[0]) + i + "/" + myear[2];
      recentMonths.push({ month: my, sold: "1" });
    }
  }

  recentMonths.forEach((item) => {
    var sold = Number(item.sold);
    orderList.forEach((order) => {
      if (typeof order.date != "undefined") {
        var temp = order?.date.split("/");
        var orderMonth = temp[0] + "/" + temp[2];
      }
      if (orderMonth == item.month) {
        sold += order.totalPrice;
        orderLastYear++;
        if (orderMonth == "12/2020") console.log(sold);
      }
    });
    item.sold = sold;
    saleLastYear += item.sold;
  });
  let monthLabel = recentMonths.map((a) => a.month);
  let monthData = recentMonths.map((a) => a.sold.toFixed(2));
  const saleByMonth = {
    labels: monthLabel,
    datasets: [
      {
        backgroundColor: "rgba(0,0,0,0.5)",
        data: monthData,
      },
    ],
  };
  //customer rate

  consumerList.forEach((item) => {
    consumerIds.push({ id: item.id, time: "0" });
  });
  var countBought = 0;
  var countReturn = 0;
  var countAbandon = 0;
  consumerIds.forEach((consumer) => {
    orderList.forEach((order) => {
      var time = Number(consumer.time);
      if (!isNaN(order?.consumer) && order.consumer == consumer.id) {
        time++;
      }
      consumer.time = "" + time;
    });
    //console.log(consumer.time);
    if (consumer.time == 1) {
      countBought++;
    } else if (consumer.time == 0) {
      countAbandon++;
    } else {
      countReturn++;
    }
  });

  const returnRate = {
    labels: ["Returning Customers", "Others"],
    datasets: [
      {
        backgroundColor: ["rgba(54,162,235,0.6)", "rgba(255,255,255,0)"],
        borderColor: "rgba(255,255,255,0)",
        data: [
          ((countReturn * 100) / (consumerIds.length - countAbandon)).toFixed(
            2
          ),
          ((countBought * 100) / (consumerIds.length - countAbandon)).toFixed(
            2
          ),
        ],
        labels: ["Return", "1-time"],
      },
    ],
  };

  const purchase = {
    labels: ["Customer Purchased", "Others"],
    datasets: [
      {
        backgroundColor: ["rgba(75,192,192,0.6)", "rgba(255,255,255,0)"],
        borderColor: "rgba(255,255,255,0)",
        data: [
          (((countReturn + countBought) * 100) / consumerIds.length).toFixed(2),
          ((countAbandon * 100) / consumerIds.length).toFixed(2),
        ],
      },
    ],
  };

  const abandon = {
    labels: ["Customer Abandon", "Others"],
    datasets: [
      {
        backgroundColor: ["rgba(255,99,132,0.6)", "rgba(255,255,255,0)"],
        borderColor: "rgba(255,255,255,0)",
        data: [
          ((countAbandon * 100) / consumerIds.length).toFixed(2),
          (((countReturn + countBought) * 100) / consumerIds.length).toFixed(2),
        ],
        labels: ["Abandoned", "Bought"],
      },
    ],
  };

  return (
    <MainTemplate>
      <h2 className="pb-3 mt-2" style={{ textAlign: "center", fontSize: 30 }}>
        Restaurant Management Dashboard
      </h2>
      <div className={classes.root}>
        <Grid justify="center" container spacing={7}>
          <Grid item xs={8}>
            <Paper elevation={3} className={classes.paper}>
              <TabPanel value={value} index={0}>
                <p>Last 12 months sales: {saleLastYear.toFixed(2)}</p>
                <p>Number of orders: {orderLastYear}</p>
              </TabPanel>
              <Bar
                data={saleByMonth}
                options={{
                  title: {
                    display: true,
                    text: "Monthly Sales",
                    fontSize: 15,
                  },
                  legend: {
                    display: false,
                  },
                }}
              ></Bar>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper elevation={3} className={classes.paper}>
              <TabPanel value={value} index={0}>
                <p>Today earnings: {todayEarn.toFixed(2)}</p>
                <p>Today orders: {todayOrder}</p>
              </TabPanel>
              <HorizontalBar
                data={daily}
                options={{
                  title: {
                    display: true,
                    text: "Daily Sale",
                    fontSize: 15,
                  },
                  legend: {
                    display: false,
                  },
                }}
              ></HorizontalBar>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper elevation={3} className={classes.paper}>
              <TabPanel value={value} index={0}>
                <p>Total sales: {orders.toFixed(2)}</p>
                <p>Number of orders: {nrOfOrder}</p>
              </TabPanel>
              <Bar
                data={sales}
                options={{
                  title: {
                    display: true,
                    text: "Total Sales",
                    fontSize: 15,
                  },
                  legend: {
                    display: false,
                  },
                }}
              ></Bar>
            </Paper>
          </Grid>

          <Grid item xs={4}>
            <Paper elevation={3} className={classes.paper}>
              <Doughnut
                data={returnRate}
                options={{
                  title: {
                    display: true,
                    text: "Returning Customer Rate",
                    fontSize: 15,
                  },
                  legend: {
                    display: false,
                  },
                }}
              ></Doughnut>
              <br></br>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper elevation={3} className={classes.paper}>
              <Doughnut
                data={purchase}
                options={{
                  title: {
                    display: true,
                    text: "Purchase Rate",
                    fontSize: 15,
                  },
                  legend: {
                    display: false,
                  },
                }}
              ></Doughnut>
              <br></br>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper elevation={3} className={classes.paper}>
              <Doughnut
                data={abandon}
                options={{
                  title: {
                    display: true,
                    text: "Abandoned Cart Rate",
                    fontSize: 15,
                  },
                  legend: {
                    display: false,
                  },
                }}
              ></Doughnut>
              <br></br>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </MainTemplate>
  );
};

export default Dashboard;
