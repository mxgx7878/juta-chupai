"use client";

import { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import InputBase from "@mui/material/InputBase";
import Switch from "@mui/material/Switch";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import RowMenu from "@/components/ui/RowMenu";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CollectionsRoundedIcon from "@mui/icons-material/CollectionsRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import PageHeader from "@/components/layout/PageHeader";
import VendorFormDialog from "@/components/vendor/VendorFormDialog";
import { vendorsActions } from "@/store";
import { notify } from "@/store/uiSlice";
import { slugify } from "@/utils/slug";
import { CategoryLabel } from "@/components/ui/CategoryIcon";

const AV = ["#4f46e5", "#0ea5a4", "#f59e0b", "#7c3aed", "#ec4899", "#2f6fed"];

export default function ListingsPage() {
  const items = useSelector((s) => s.vendors.items);
  const dispatch = useDispatch();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [edit, setEdit] = useState(null);

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return items;
    return items.filter((v) => v.name.toLowerCase().includes(t) || v.category.toLowerCase().includes(t));
  }, [items, q]);

  const published = items.filter((v) => v.published).length;

  return (
    <Box>
      <PageHeader
        overline="Marketplace"
        title="Listings"
        subtitle={`${items.length} vendor listings · ${published} published`}
      />

      <Card sx={{ p: { xs: 2, md: 3 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 1.5, height: 42, maxWidth: 360, mb: 2, borderRadius: 2, border: "1px solid", borderColor: "divider", bgcolor: "grey.50" }}>
          <SearchRoundedIcon fontSize="small" sx={{ color: "text.secondary" }} />
          <InputBase placeholder="Search listings…" value={q} onChange={(e) => setQ(e.target.value)} sx={{ fontSize: 14, flex: 1 }} />
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 760 }}>
            <TableHead>
              <TableRow>
                <TableCell>Listing</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="center">Packages</TableCell>
                <TableCell align="center">Images</TableCell>
                <TableCell>Starting price</TableCell>
                <TableCell align="center">Published</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((v, i) => (
                <TableRow key={v.name} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                      <Avatar variant="rounded" sx={{ bgcolor: AV[i % AV.length], borderRadius: 2, width: 38, height: 38, fontSize: 14 }}>
                        {v.name[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={700}>
                          {v.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {v.city} · by {v.owner}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>
                    <CategoryLabel category={v.category} />
                  </TableCell>
                  <TableCell align="center">
                    <Chip size="small" icon={<Inventory2RoundedIcon sx={{ fontSize: 15 }} />} label={v.packages?.length || 0} sx={{ bgcolor: "grey.100", fontWeight: 700 }} />
                  </TableCell>
                  <TableCell align="center">
                    <Chip size="small" icon={<CollectionsRoundedIcon sx={{ fontSize: 15 }} />} label={v.gallery?.length || 0} sx={{ bgcolor: "grey.100", fontWeight: 700 }} />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "primary.main" }}>
                    {v.packages?.[0]?.price || "—"}
                  </TableCell>
                  <TableCell align="center">
                    <Switch
                      checked={!!v.published}
                      onChange={() => {
                        dispatch(vendorsActions.toggleField({ id: v.name, field: "published" }));
                        dispatch(notify(v.published ? `${v.name} unpublished` : `${v.name} published`));
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <RowMenu
                      actions={[
                        { label: "Preview", icon: <VisibilityRoundedIcon fontSize="small" />, onClick: () => router.push(`/vendors/${slugify(v.name)}`) },
                        { label: "Edit listing", icon: <EditRoundedIcon fontSize="small" />, onClick: () => setEdit(v) },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <VendorFormDialog
        open={!!edit}
        vendor={edit}
        onClose={() => setEdit(null)}
        onSubmit={(data) => {
          if (edit.name !== data.name) {
            dispatch(vendorsActions.remove(edit.name));
            dispatch(vendorsActions.add({ ...edit, ...data }));
          } else {
            dispatch(vendorsActions.update({ ...edit, ...data }));
          }
          dispatch(notify("Listing updated"));
        }}
      />
    </Box>
  );
}
