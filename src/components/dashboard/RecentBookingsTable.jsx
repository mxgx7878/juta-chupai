"use client";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import { recentBookings, statusColor } from "@/data/dashboard";

export default function RecentBookingsTable() {
  return (
    <TableContainer sx={{ mx: -1 }}>
      <Table sx={{ minWidth: 560 }}>
        <TableHead>
          <TableRow>
            <TableCell>Event</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Vendor</TableCell>
            <TableCell>Date</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {recentBookings.map((b) => (
            <TableRow key={b.id} hover>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={700}>
                  {b.event}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  #{b.id}
                </Typography>
              </TableCell>
              <TableCell sx={{ color: "text.secondary" }}>{b.customer}</TableCell>
              <TableCell sx={{ color: "text.secondary" }}>{b.vendor}</TableCell>
              <TableCell sx={{ color: "text.secondary" }}>{b.date}</TableCell>
              <TableCell align="right">
                <Typography variant="body2" fontWeight={700}>
                  {b.amount}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  size="small"
                  label={b.status}
                  sx={(t) => {
                    const c = t.palette[statusColor[b.status]] || t.palette.grey;
                    return {
                      bgcolor: (c.light || t.palette.grey[100]),
                      color: (c.dark || c.main || t.palette.text.secondary),
                      fontWeight: 700,
                    };
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
