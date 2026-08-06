"use client";

import { useState, useMemo, Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import Rating from "@mui/material/Rating";
import Tooltip from "@mui/material/Tooltip";
import InputBase from "@mui/material/InputBase";
import MuiLink from "@mui/material/Link";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import AddBusinessRoundedIcon from "@mui/icons-material/AddBusinessRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import PageHeader from "@/components/layout/PageHeader";
import StatusChip from "@/components/ui/StatusChip";
import RowMenu from "@/components/ui/RowMenu";
import VendorFormDialog from "@/components/vendor/VendorFormDialog";
import { vendorsActions } from "@/store";
import { notify } from "@/store/uiSlice";
import { slugify } from "@/utils/slug";
import { CategoryLabel } from "@/components/ui/CategoryIcon";

const AV = ["#4f46e5", "#0ea5a4", "#f59e0b", "#7c3aed", "#ec4899", "#2f6fed"];
const TABS = ["All", "Approved", "Pending", "Rejected"];
const initials = (n) => n.split(" ").map((p) => p[0]).join("").slice(0, 2);

function VendorsContent() {
  const items = useSelector((s) => s.vendors.items);
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const catParam = searchParams.get("cat");
  const [tab, setTab] = useState(0);
  const [q, setQ] = useState("");
  const [dialog, setDialog] = useState({ open: false, vendor: null });

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    return items.filter((v) => {
      const okTab = tab === 0 || v.status === TABS[tab];
      const okCat = !catParam || v.category === catParam;
      const okQ = !t || v.name.toLowerCase().includes(t) || v.category.toLowerCase().includes(t) || v.city.toLowerCase().includes(t);
      return okTab && okCat && okQ;
    });
  }, [items, tab, q, catParam]);

  const pendingCount = items.filter((v) => v.status === "Pending").length;

  const submit = (data) => {
    if (dialog.vendor) {
      if (dialog.vendor.name !== data.name) {
        dispatch(vendorsActions.remove(dialog.vendor.name));
        dispatch(vendorsActions.add({ ...dialog.vendor, ...data }));
      } else {
        dispatch(vendorsActions.update({ ...dialog.vendor, ...data }));
      }
      dispatch(notify("Vendor updated"));
    } else {
      dispatch(
        vendorsActions.add({
          ...data,
          rating: 0,
          reviews: 0,
          bookings: 0,
          status: "Pending",
          verified: false,
          premium: false,
          featured: false,
          published: true,
        }),
      );
      dispatch(notify("Vendor added as pending"));
      setTab(2);
    }
  };

  return (
    <Box>
      <PageHeader
        overline="Marketplace"
        title="Vendors"
        subtitle={`${items.length} vendors · ${pendingCount} awaiting approval`}
        action={
          <Button variant="contained" startIcon={<AddBusinessRoundedIcon />} onClick={() => setDialog({ open: true, vendor: null })}>
            Add vendor
          </Button>
        }
      />

      <Card sx={{ p: { xs: 2, md: 3 } }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ justifyContent: "space-between", alignItems: { md: "center" }, mb: 2 }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ minHeight: 40, "& .MuiTab-root": { minHeight: 40, textTransform: "none", fontWeight: 600 } }}>
            {TABS.map((t) => (
              <Tab key={t} label={t} />
            ))}
          </Tabs>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 1.5, height: 40, width: { xs: "100%", md: 280 }, borderRadius: 2, border: "1px solid", borderColor: "divider", bgcolor: "grey.50" }}>
            <SearchRoundedIcon fontSize="small" sx={{ color: "text.secondary" }} />
            <InputBase placeholder="Search vendors…" value={q} onChange={(e) => setQ(e.target.value)} sx={{ fontSize: 14, flex: 1 }} />
          </Box>
        </Stack>

        <TableContainer>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell>Vendor</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell align="center">Bookings</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((v, i) => (
                <TableRow key={v.name} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                      <Avatar variant="rounded" sx={{ bgcolor: AV[i % AV.length], borderRadius: 2, width: 38, height: 38, fontSize: 14 }}>
                        {initials(v.name)}
                      </Avatar>
                      <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                        <MuiLink component={Link} href={`/vendors/${slugify(v.name)}`} underline="hover" sx={{ fontWeight: 700, color: "text.primary" }}>
                          {v.name}
                        </MuiLink>
                        {v.verified && (
                          <Tooltip title="Verified vendor">
                            <VerifiedRoundedIcon sx={{ fontSize: 16, color: "primary.main" }} />
                          </Tooltip>
                        )}
                      </Stack>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>
                    <CategoryLabel category={v.category} />
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>{v.city}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                      <Rating value={v.rating} precision={0.1} size="small" readOnly max={5} sx={{ fontSize: 15 }} />
                      <Typography variant="caption" color="text.secondary">
                        {v.rating || "—"}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="center">{v.bookings}</TableCell>
                  <TableCell>
                    <StatusChip status={v.status} />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end", alignItems: "center" }}>
                      {v.status === "Pending" && (
                        <>
                          <Button size="small" variant="contained" color="success" onClick={() => { dispatch(vendorsActions.setStatus({ id: v.name, status: "Approved" })); dispatch(notify(`${v.name} approved`)); }}>
                            Approve
                          </Button>
                          <Button size="small" variant="outlined" color="inherit" onClick={() => { dispatch(vendorsActions.setStatus({ id: v.name, status: "Rejected" })); dispatch(notify({ message: `${v.name} rejected`, severity: "error" })); }}>
                            Reject
                          </Button>
                        </>
                      )}
                      <RowMenu
                        actions={[
                          { label: "View profile", icon: <VisibilityRoundedIcon fontSize="small" />, onClick: () => { window.location.href = `/vendors/${slugify(v.name)}`; } },
                          { label: "Edit", icon: <EditRoundedIcon fontSize="small" />, onClick: () => setDialog({ open: true, vendor: v }) },
                          { label: "Delete", icon: <DeleteOutlineRoundedIcon fontSize="small" />, danger: true, onClick: () => { dispatch(vendorsActions.remove(v.name)); dispatch(notify({ message: "Vendor deleted", severity: "info" })); } },
                        ]}
                      />
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 5, color: "text.secondary" }}>
                    No vendors here.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <VendorFormDialog
        open={dialog.open}
        vendor={dialog.vendor}
        onClose={() => setDialog({ open: false, vendor: null })}
        onSubmit={submit}
      />
    </Box>
  );
}

export default function VendorsPage() {
  return (
    <Suspense fallback={null}>
      <VendorsContent />
    </Suspense>
  );
}
