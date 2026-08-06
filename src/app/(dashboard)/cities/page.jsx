"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import PageHeader from "@/components/layout/PageHeader";
import FormDialog from "@/components/ui/FormDialog";
import { citiesActions } from "@/store";
import { notify } from "@/store/uiSlice";

export default function CitiesPage() {
  const items = useSelector((s) => s.cities.items);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  return (
    <Box>
      <PageHeader
        overline="Marketplace"
        title="Cities"
        subtitle={`${items.filter((c) => c.enabled).length} of ${items.length} cities enabled in discovery`}
        action={
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setOpen(true)}>
            Add city
          </Button>
        }
      />

      <Card sx={{ p: { xs: 1, md: 2 } }}>
        <TableContainer>
          <Table sx={{ minWidth: 640 }}>
            <TableHead>
              <TableRow>
                <TableCell>City</TableCell>
                <TableCell align="center">Vendors</TableCell>
                <TableCell align="center">Bookings</TableCell>
                <TableCell align="center">Enabled</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((c) => (
                <TableRow key={c.name} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                      <Avatar variant="rounded" sx={{ bgcolor: "grey.100", color: "primary.main", borderRadius: 2, width: 36, height: 36 }}>
                        <PlaceRoundedIcon fontSize="small" />
                      </Avatar>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {c.name}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="center">{c.vendors}</TableCell>
                  <TableCell align="center">{c.bookings}</TableCell>
                  <TableCell align="center">
                    <Switch
                      checked={c.enabled}
                      onChange={() => {
                        dispatch(citiesActions.toggleField({ id: c.name, field: "enabled" }));
                        dispatch(notify(`${c.name} ${c.enabled ? "disabled" : "enabled"}`));
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => {
                        dispatch(citiesActions.remove(c.name));
                        dispatch(notify({ message: `${c.name} removed`, severity: "info" }));
                      }}
                    >
                      <DeleteOutlineRoundedIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <FormDialog
        open={open}
        title="Add city"
        submitLabel="Add"
        fields={[
          { name: "name", label: "City name", required: true, full: true },
          { name: "vendors", label: "Vendors", type: "number", defaultValue: 0 },
          { name: "bookings", label: "Bookings", type: "number", defaultValue: 0 },
        ]}
        onClose={() => setOpen(false)}
        onSubmit={(v) => {
          dispatch(
            citiesActions.add({
              name: v.name,
              vendors: Number(v.vendors) || 0,
              bookings: Number(v.bookings) || 0,
              enabled: true,
            }),
          );
          dispatch(notify("City added"));
        }}
      />
    </Box>
  );
}
