"use client";

import { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import InputBase from "@mui/material/InputBase";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PageHeader from "@/components/layout/PageHeader";
import StatusChip from "@/components/ui/StatusChip";
import RowMenu from "@/components/ui/RowMenu";
import FormDialog from "@/components/ui/FormDialog";
import { customersActions } from "@/store";
import { notify } from "@/store/uiSlice";

const AV = ["#4f46e5", "#0ea5a4", "#f59e0b", "#7c3aed", "#ec4899", "#2f6fed"];
const initials = (n) => n.split(" ").map((p) => p[0]).join("").slice(0, 2);

export default function CustomersPage() {
  const items = useSelector((s) => s.customers.items);
  const dispatch = useDispatch();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return items;
    return items.filter(
      (c) => c.name.toLowerCase().includes(t) || c.email.toLowerCase().includes(t) || c.city.toLowerCase().includes(t),
    );
  }, [items, q]);

  return (
    <Box>
      <PageHeader
        overline="Marketplace"
        title="Customers"
        subtitle={`${items.length} registered customers`}
        action={
          <Button variant="contained" startIcon={<PersonAddAlt1RoundedIcon />} onClick={() => setOpen(true)}>
            Add customer
          </Button>
        }
      />

      <Card sx={{ p: { xs: 2, md: 3 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 1.5,
            height: 42,
            maxWidth: 360,
            mb: 2,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "grey.50",
          }}
        >
          <SearchRoundedIcon fontSize="small" sx={{ color: "text.secondary" }} />
          <InputBase
            placeholder="Search customers…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            sx={{ fontSize: 14, flex: 1 }}
          />
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 720 }}>
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>City</TableCell>
                <TableCell align="center">Events</TableCell>
                <TableCell align="right">Total spend</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((c, i) => (
                <TableRow key={c.email} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                      <Avatar sx={{ bgcolor: AV[i % AV.length], width: 36, height: 36, fontSize: 14 }}>
                        {initials(c.name)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={700}>
                          {c.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {c.email}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>{c.city}</TableCell>
                  <TableCell align="center">{c.events}</TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight={700}>
                      {c.spend}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>{c.joined}</TableCell>
                  <TableCell>
                    <StatusChip status={c.status} />
                  </TableCell>
                  <TableCell align="right">
                    <RowMenu
                      actions={[
                        c.status === "Suspended"
                          ? {
                              label: "Activate",
                              icon: <CheckCircleRoundedIcon fontSize="small" />,
                              onClick: () => {
                                dispatch(customersActions.update({ email: c.email, status: "Active" }));
                                dispatch(notify(`${c.name} activated`));
                              },
                            }
                          : {
                              label: "Suspend",
                              icon: <BlockRoundedIcon fontSize="small" />,
                              onClick: () => {
                                dispatch(customersActions.update({ email: c.email, status: "Suspended" }));
                                dispatch(notify({ message: `${c.name} suspended`, severity: "warning" }));
                              },
                            },
                        {
                          label: "Delete",
                          icon: <DeleteOutlineRoundedIcon fontSize="small" />,
                          danger: true,
                          onClick: () => {
                            dispatch(customersActions.remove(c.email));
                            dispatch(notify({ message: "Customer deleted", severity: "info" }));
                          },
                        },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 5, color: "text.secondary" }}>
                    No customers match “{q}”.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <FormDialog
        open={open}
        title="Add customer"
        submitLabel="Add"
        fields={[
          { name: "name", label: "Full name", required: true },
          { name: "email", label: "Email", required: true },
          { name: "city", label: "City", defaultValue: "Lahore" },
        ]}
        onClose={() => setOpen(false)}
        onSubmit={(v) => {
          dispatch(
            customersActions.add({
              name: v.name,
              email: v.email,
              city: v.city || "—",
              events: 0,
              spend: "PKR 0",
              status: "Active",
              joined: "Aug 2026",
            }),
          );
          dispatch(notify("Customer added"));
        }}
      />
    </Box>
  );
}
