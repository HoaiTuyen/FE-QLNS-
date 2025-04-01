import { useEffect, useState } from "react";
import {
  TableContainer,
  Paper,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  addEmployee,
  fetchUsers,
  fetchPositions,
  fetchDepartments,
} from "../../../services/employeeService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreateForm = () => {
  const [employee, setEmployee] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "MALE",
    phone: "",
    address: "",
    joiningDate: "",
    employeeStatus: "WORKING",
    userId: "",
    positionId: "",
    departmentId: "",
  });

  const [users, setUsers] = useState([]);
  const [positions, setPositions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setUsers(await fetchUsers());
      setPositions(await fetchPositions());
      setDepartments(await fetchDepartments());
    };
    loadData();
  }, []);

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addEmployee(employee);
      toast.success("Thêm nhân viên thành công!");
      navigate("/employees");
    } catch (error) {
      console.error("Lỗi khi thêm nhân viên:", error);
      toast.error("Lỗi khi thêm nhân viên!");
    }
  };

  //   return (
  //     <TableContainer component={Paper} sx={{ padding: "2cm" }}>
  //       <Table sx={{ minWidth: 650 }}>
  //         <TableHead>
  //           <TableRow>
  //             <TableCell colSpan={4} align="center" sx={{ fontSize: "24px" }}>
  //               {" "}
  //               <h2 className="p-4 text-center">Form Thêm Nhân Viên</h2>
  //             </TableCell>
  //           </TableRow>
  //         </TableHead>
  //         <TableBody>
  //           <TableRow>
  //             <TableCell></TableCell>
  //             <TableCell colSpan={2}>
  //         <form onSubmit={handleSubmit}>
  //           <TextField
  //             name="fullName"
  //             label="Họ và Tên"
  //             onChange={handleChange}
  //             fullWidth
  //             required
  //           />
  //           <br />
  //           <br />
  //           <TextField
  //             name="dateOfBirth"
  //             label="Ngày sinh"
  //             type="date"
  //             onChange={handleChange}
  //             fullWidth
  //             InputLabelProps={{ shrink: true }}
  //             required
  //           />
  //           <br />
  //           <br />
  //           <TextField
  //             name="phone"
  //             label="Số điện thoại"
  //             onChange={handleChange}
  //             fullWidth
  //             required
  //           />
  //           <br />
  //           <br />
  //           <TextField
  //             name="address"
  //             label="Địa chỉ"
  //             onChange={handleChange}
  //             fullWidth
  //             required
  //           />
  //           <br />
  //           <br />
  //           <TextField
  //             name="dateOfWorking"
  //             label="Ngày vào làm"
  //             type="date"
  //             onChange={handleChange}
  //             fullWidth
  //             InputLabelProps={{ shrink: true }}
  //             required
  //           />
  //           </TableCell>
  //           <FormControl sx={{ width: "15cm" }}>
  //             <InputLabel>Người dùng</InputLabel>
  //             <Select
  //               name="userId"
  //               value={employee.userId || ""}
  //               onChange={handleChange}
  //             >
  //               {users.map((u) => (
  //                 <MenuItem key={u.id} value={u.id}>
  //                   {u.username}
  //                 </MenuItem>
  //               ))}
  //             </Select>
  //           </FormControl>
  //           <br />
  //           <br />
  //           <FormControl sx={{ width: "15cm" }}>
  //             <InputLabel>Chức vụ</InputLabel>
  //             <Select
  //               name="positionId"
  //               value={employee.positionId}
  //               onChange={handleChange}
  //             >
  //               {positions.map((p) => (
  //                 <MenuItem key={p.id} value={p.id}>
  //                   {p.name}
  //                 </MenuItem>
  //               ))}
  //             </Select>
  //           </FormControl>
  //           <br />
  //           <br />
  //           <FormControl sx={{ width: "15cm" }}>
  //             <InputLabel>Phòng ban</InputLabel>
  //             <Select
  //               name="departmentId"
  //               value={employee.departmentId}
  //               onChange={handleChange}
  //             >
  //               {departments.map((d) => (
  //                 <MenuItem key={d.id} value={d.id}>
  //                   {d.name}
  //                 </MenuItem>
  //               ))}
  //             </Select>
  //           </FormControl>
  //           <br />
  //           <br />
  //           <Button type="button" variant="contained" color="secondary">
  //             Trở về
  //           </Button>
  //           <Button type="reset" variant="contained" color="warning">
  //             Reset
  //           </Button>
  //           <Button type="submit" variant="contained">
  //             Thêm Nhân Viên
  //           </Button>
  //         </form>
  //       </Table>
  //     </TableContainer>
  //   );
  // };
};
export default CreateForm;
