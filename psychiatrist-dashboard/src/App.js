import React, { useState, useMemo } from "react";
import {
  Calendar,
  Users,
  Settings,
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  Edit2,
  Trash2,
  Clock,
  FileText,
  Pill,
  AlertCircle,
  Save,
} from "lucide-react";

// Mock data
const initialClients = [
  {
    id: 1,
    name: "Sarah Johnson",
    dob: "1985-03-15",
    phone: "555-0101",
    email: "sarah.j@email.com",
    address: "123 Main St, City, State 12345",
    emergencyContact: "John Johnson",
    emergencyPhone: "555-0102",
    consentGiven: true,
    privacyAcknowledged: true,
    presentingConcern: "Anxiety and depression",
    goals: "Manage anxiety symptoms, improve sleep",
    suicideRisk: true,
    selfHarmRisk: false,
    medications: [
      {
        id: 1,
        name: "Sertraline 50mg",
        prescribedDate: "2024-09-15",
        status: "Active",
      },
      {
        id: 2,
        name: "Lorazepam 0.5mg PRN",
        prescribedDate: "2024-10-01",
        status: "Active",
      },
    ],
  },
  {
    id: 2,
    name: "Michael Chen",
    dob: "1992-07-22",
    phone: "555-0201",
    email: "m.chen@email.com",
    address: "456 Oak Ave, City, State 12345",
    emergencyContact: "Lisa Chen",
    emergencyPhone: "555-0202",
    consentGiven: true,
    privacyAcknowledged: true,
    presentingConcern: "ADHD management",
    goals: "Improve focus and work performance",
    suicideRisk: false,
    selfHarmRisk: false,
    medications: [
      {
        id: 3,
        name: "Adderall XR 20mg",
        prescribedDate: "2024-08-10",
        status: "Active",
      },
    ],
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    dob: "1978-11-30",
    phone: "555-0301",
    email: "emily.r@email.com",
    address: "789 Pine Rd, City, State 12345",
    emergencyContact: "Carlos Rodriguez",
    emergencyPhone: "555-0302",
    consentGiven: true,
    privacyAcknowledged: true,
    presentingConcern: "Bipolar disorder management",
    goals: "Mood stabilization, prevent episodes",
    suicideRisk: false,
    selfHarmRisk: true,
    medications: [
      {
        id: 4,
        name: "Lithium 300mg",
        prescribedDate: "2024-07-20",
        status: "Active",
      },
      {
        id: 5,
        name: "Quetiapine 100mg",
        prescribedDate: "2024-07-20",
        status: "Active",
      },
    ],
  },
];

const initialAppointments = [
  {
    id: 1,
    clientId: 1,
    date: "2025-10-29",
    time: "09:00",
    status: "Confirmed",
    type: "client",
    notes:
      "Patient reports improved sleep with current medication regimen. Anxiety levels remain moderate. Discussed coping strategies.",
    checkedIn: false,
  },
  {
    id: 2,
    clientId: 2,
    date: "2025-10-29",
    time: "10:00",
    status: "Confirmed",
    type: "client",
    notes: "",
    checkedIn: false,
  },
  {
    id: 3,
    clientId: null,
    date: "2025-10-29",
    time: "11:00",
    status: "Confirmed",
    type: "personal",
    title: "Lunch Break",
    notes: "",
    checkedIn: false,
  },
  {
    id: 4,
    clientId: 3,
    date: "2025-10-29",
    time: "14:00",
    status: "Tentative",
    type: "client",
    notes: "",
    checkedIn: false,
  },
  {
    id: 5,
    clientId: 1,
    date: "2025-10-30",
    time: "09:00",
    status: "Confirmed",
    type: "client",
    notes: "",
    checkedIn: false,
  },
  {
    id: 6,
    clientId: 2,
    date: "2025-10-31",
    time: "10:00",
    status: "Completed",
    type: "client",
    notes:
      "Medication adjustment discussed. Patient tolerating Adderall well. Follow up in 2 weeks.",
    checkedIn: true,
  },
  {
    id: 7,
    clientId: 1,
    date: "2025-11-05",
    time: "09:00",
    status: "Tentative",
    type: "client",
    notes: "",
    checkedIn: false,
  },
  {
    id: 8,
    clientId: 3,
    date: "2025-11-06",
    time: "15:00",
    status: "Tentative",
    type: "client",
    notes: "",
    checkedIn: false,
  },
];

function App() {
  const [view, setView] = useState("dashboard");
  const [clients, setClients] = useState(initialClients);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [calendarView, setCalendarView] = useState("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [appointmentPage, setAppointmentPage] = useState(0);

  const [appointmentForm, setAppointmentForm] = useState({
    clientId: "",
    date: "",
    time: "",
    type: "client",
    title: "",
    status: "Confirmed",
  });

  const [recurringForm, setRecurringForm] = useState({
    clientId: "",
    startDate: "",
    time: "",
    frequency: "weekly",
    occurrences: 4,
  });

  const getClientName = (clientId) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? client.name : "Unknown";
  };

  const filteredAppointments = useMemo(() => {
    let filtered = appointments;

    if (searchTerm) {
      filtered = filtered.filter((apt) => {
        if (apt.type === "personal")
          return apt.title?.toLowerCase().includes(searchTerm.toLowerCase());
        const client = clients.find((c) => c.id === apt.clientId);
        return client?.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(
        (apt) => apt.status.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    if (filterDate) {
      filtered = filtered.filter((apt) => apt.date === filterDate);
    }

    return filtered.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA - dateB;
    });
  }, [appointments, searchTerm, filterStatus, filterDate, clients]);

  const upcomingAppointments = filteredAppointments.filter((apt) => {
    const aptDate = new Date(`${apt.date}T${apt.time}`);
    return aptDate >= new Date();
  });

  const paginatedAppointments = upcomingAppointments.slice(
    appointmentPage * 10,
    (appointmentPage + 1) * 10
  );

  const handleCreateAppointment = () => {
    if (!appointmentForm.date || !appointmentForm.time) return;
    if (appointmentForm.type === "client" && !appointmentForm.clientId) return;
    if (appointmentForm.type === "personal" && !appointmentForm.title) return;

    const newAppointment = {
      id: Math.max(...appointments.map((a) => a.id), 0) + 1,
      ...appointmentForm,
      clientId:
        appointmentForm.type === "client"
          ? parseInt(appointmentForm.clientId)
          : null,
      notes: "",
      checkedIn: false,
    };

    setAppointments([...appointments, newAppointment]);
    setShowAppointmentModal(false);
    setAppointmentForm({
      clientId: "",
      date: "",
      time: "",
      type: "client",
      title: "",
      status: "Confirmed",
    });
  };

  const handleCreateRecurring = () => {
    if (
      !recurringForm.clientId ||
      !recurringForm.startDate ||
      !recurringForm.time
    )
      return;

    const newAppointments = [];
    const startDate = new Date(recurringForm.startDate);

    for (let i = 0; i < recurringForm.occurrences; i++) {
      const aptDate = new Date(startDate);

      if (recurringForm.frequency === "weekly") {
        aptDate.setDate(startDate.getDate() + i * 7);
      } else if (recurringForm.frequency === "biweekly") {
        aptDate.setDate(startDate.getDate() + i * 14);
      } else if (recurringForm.frequency === "monthly") {
        aptDate.setMonth(startDate.getMonth() + i);
      }

      newAppointments.push({
        id: Math.max(...appointments.map((a) => a.id), 0) + i + 1,
        clientId: parseInt(recurringForm.clientId),
        date: aptDate.toISOString().split("T")[0],
        time: recurringForm.time,
        status: "Tentative",
        type: "client",
        notes: "",
        checkedIn: false,
      });
    }

    setAppointments([...appointments, ...newAppointments]);
    setShowRecurringModal(false);
    setRecurringForm({
      clientId: "",
      startDate: "",
      time: "",
      frequency: "weekly",
      occurrences: 4,
    });
  };

  const handleUpdateAppointment = (id, updates) => {
    setAppointments(
      appointments.map((apt) => (apt.id === id ? { ...apt, ...updates } : apt))
    );
  };

  const handleDeleteAppointment = (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      setAppointments(appointments.filter((apt) => apt.id !== id));
      setSelectedAppointment(null);
    }
  };

  const handleCheckIn = (id) => {
    handleUpdateAppointment(id, { checkedIn: true, status: "Confirmed" });
  };

  const getCalendarDays = () => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay());
    const days = [];

    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }

    return days;
  };

  const getAppointmentsForDate = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return appointments.filter((apt) => apt.date === dateStr);
  };

  const getClientAppointments = (clientId) => {
    return appointments
      .filter((apt) => apt.clientId === clientId)
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateB - dateA;
      });
  };

  const Sidebar = () => (
    <div className="w-64 bg-slate-800 text-white p-6 flex flex-col h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Psychiatrist Portal</h1>
      </div>

      <nav className="flex-1 space-y-2">
        <button
          onClick={() => setView("dashboard")}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
            view === "dashboard" ? "bg-slate-700" : "hover:bg-slate-700"
          }`}
        >
          <Calendar size={20} />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setView("clients")}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
            view === "clients" ? "bg-slate-700" : "hover:bg-slate-700"
          }`}
        >
          <Users size={20} />
          <span>Clients</span>
        </button>

        <button
          onClick={() => setView("settings")}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
            view === "settings" ? "bg-slate-700" : "hover:bg-slate-700"
          }`}
        >
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </nav>
    </div>
  );

  const DashboardView = () => (
    <div className="flex-1 p-8 overflow-auto bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowAppointmentModal(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} />
            <span>New Appointment</span>
          </button>
          <button
            onClick={() => setShowRecurringModal(true)}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <Clock size={20} />
            <span>Recurring</span>
          </button>
        </div>
      </div>

      <div className="mb-6 flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="tentative">Tentative</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="no-show">No-show</option>
        </select>

        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        />
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-xl font-semibold">Calendar View</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setCalendarView("day")}
              className={`px-3 py-1 rounded ${
                calendarView === "day"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setCalendarView("week")}
              className={`px-3 py-1 rounded ${
                calendarView === "week"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setCalendarView("month")}
              className={`px-3 py-1 rounded ${
                calendarView === "month"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              Month
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => {
                const newDate = new Date(currentDate);
                if (calendarView === "week")
                  newDate.setDate(newDate.getDate() - 7);
                else if (calendarView === "month")
                  newDate.setMonth(newDate.getMonth() - 1);
                else newDate.setDate(newDate.getDate() - 1);
                setCurrentDate(newDate);
              }}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <ChevronLeft size={20} />
            </button>

            <h4 className="text-lg font-semibold">
              {calendarView === "month"
                ? currentDate.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })
                : currentDate.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
            </h4>

            <button
              onClick={() => {
                const newDate = new Date(currentDate);
                if (calendarView === "week")
                  newDate.setDate(newDate.getDate() + 7);
                else if (calendarView === "month")
                  newDate.setMonth(newDate.getMonth() + 1);
                else newDate.setDate(newDate.getDate() + 1);
                setCurrentDate(newDate);
              }}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {calendarView === "week" && (
            <div className="grid grid-cols-7 gap-2">
              {getCalendarDays().map((day, idx) => {
                const apts = getAppointmentsForDate(day);
                const isToday =
                  day.toDateString() === new Date().toDateString();

                return (
                  <div
                    key={idx}
                    className={`border rounded-lg p-2 min-h-32 ${
                      isToday ? "bg-blue-50 border-blue-300" : ""
                    }`}
                  >
                    <div className="font-semibold text-sm mb-2">
                      {day.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "numeric",
                        day: "numeric",
                      })}
                    </div>
                    <div className="space-y-1">
                      {apts.map((apt) => (
                        <div
                          key={apt.id}
                          onClick={() => setSelectedAppointment(apt)}
                          className={`text-xs p-1 rounded cursor-pointer ${
                            apt.status === "Confirmed"
                              ? "bg-green-100 hover:bg-green-200"
                              : apt.status === "Tentative"
                              ? "bg-yellow-100 hover:bg-yellow-200"
                              : apt.status === "Completed"
                              ? "bg-gray-100 hover:bg-gray-200"
                              : "bg-red-100 hover:bg-red-200"
                          }`}
                        >
                          <div className="font-semibold">{apt.time}</div>
                          <div className="truncate">
                            {apt.type === "personal"
                              ? apt.title
                              : getClientName(apt.clientId)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="text-xl font-semibold">Upcoming Appointments</h3>
        </div>

        <div className="divide-y">
          {paginatedAppointments.map((apt) => {
            const client =
              apt.type === "client"
                ? clients.find((c) => c.id === apt.clientId)
                : null;

            return (
              <div
                key={apt.id}
                onClick={() => setSelectedAppointment(apt)}
                className="p-4 hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-semibold text-lg">
                        {apt.type === "personal"
                          ? apt.title
                          : getClientName(apt.clientId)}
                      </h4>
                      {client &&
                        (client.suicideRisk || client.selfHarmRisk) && (
                          <AlertCircle className="text-red-600" size={20} />
                        )}
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          apt.status === "Confirmed"
                            ? "bg-green-100 text-green-800"
                            : apt.status === "Tentative"
                            ? "bg-yellow-100 text-yellow-800"
                            : apt.status === "Completed"
                            ? "bg-gray-100 text-gray-800"
                            : apt.status === "Cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {apt.status}
                      </span>
                      {apt.checkedIn && (
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                          Checked In
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mt-1">
                      {new Date(`${apt.date}T${apt.time}`).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}{" "}
                      at {apt.time}
                    </p>
                  </div>

                  {apt.type === "client" &&
                    !apt.checkedIn &&
                    apt.status !== "Completed" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCheckIn(apt.id);
                        }}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Check In
                      </button>
                    )}
                </div>
              </div>
            );
          })}
        </div>

        {upcomingAppointments.length > 10 && (
          <div className="p-4 border-t flex justify-between items-center">
            <button
              onClick={() =>
                setAppointmentPage(Math.max(0, appointmentPage - 1))
              }
              disabled={appointmentPage === 0}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {appointmentPage + 1} of{" "}
              {Math.ceil(upcomingAppointments.length / 10)}
            </span>
            <button
              onClick={() => setAppointmentPage(appointmentPage + 1)}
              disabled={
                (appointmentPage + 1) * 10 >= upcomingAppointments.length
              }
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const ClientsView = () => (
    <div className="flex-1 p-8 overflow-auto bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Client List</h2>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {clients
          .filter((client) =>
            client.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((client) => (
            <div
              key={client.id}
              onClick={() => setSelectedClient(client)}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg cursor-pointer transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold">{client.name}</h3>
                    {(client.suicideRisk || client.selfHarmRisk) && (
                      <div className="flex items-center space-x-1 text-red-600">
                        <AlertCircle size={20} />
                        <span className="text-sm font-semibold">High Risk</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600">
                    DOB: {new Date(client.dob).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    {client.email} • {client.phone}
                  </p>
                  <p className="text-gray-700 mt-2 font-semibold">
                    Presenting: {client.presentingConcern}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    Active Medications
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {
                      client.medications.filter((m) => m.status === "Active")
                        .length
                    }
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  const SettingsView = () => (
    <div className="flex-1 p-8 overflow-auto bg-gray-100">
      <h2 className="text-3xl font-bold mb-6">Settings</h2>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Data Management</h3>

        <div className="space-y-4">
          <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Export All Client Data
          </button>

          <button className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Backup Database
          </button>

          <button className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
            Generate Audit Report
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Audit Trail</h3>
        <p className="text-gray-600 mb-4">Recent system activities</p>

        <div className="space-y-2 text-sm">
          <div className="p-3 bg-gray-50 rounded">
            <span className="font-semibold">Appointment Created:</span> Sarah
            Johnson - 2025-10-29 09:00
            <div className="text-gray-500 text-xs mt-1">
              By: Dr. Smith • 2025-10-28 14:30
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <span className="font-semibold">Session Note Updated:</span> Michael
            Chen
            <div className="text-gray-500 text-xs mt-1">
              By: Dr. Smith • 2025-10-27 11:15
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <span className="font-semibold">Medication Added:</span> Emily
            Rodriguez - Lithium 300mg
            <div className="text-gray-500 text-xs mt-1">
              By: Dr. Smith • 2025-10-26 16:00
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ClientDetailModal = ({ client, onClose }) => {
    const clientAppointments = getClientAppointments(client.id);
    const [showClientCalendar, setShowClientCalendar] = useState(false);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
          <div className="p-6 border-b flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">{client.name}</h2>
              {(client.suicideRisk || client.selfHarmRisk) && (
                <div className="flex items-center space-x-2 text-red-600 mt-1">
                  <AlertCircle size={20} />
                  <span className="font-semibold">
                    Risk Factors: {client.suicideRisk && "Suicide"}{" "}
                    {client.suicideRisk && client.selfHarmRisk && "•"}{" "}
                    {client.selfHarmRisk && "Self-Harm"}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">
                  Personal Information
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-semibold">Date of Birth:</span>{" "}
                    {new Date(client.dob).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span> {client.email}
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span> {client.phone}
                  </p>
                  <p>
                    <span className="font-semibold">Address:</span>{" "}
                    {client.address}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">
                  Emergency Contact
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-semibold">Name:</span>{" "}
                    {client.emergencyContact}
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span>{" "}
                    {client.emergencyPhone}
                  </p>
                </div>

                <h3 className="font-semibold text-lg mt-4 mb-3">Consent</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    ✓ Informed Consent: {client.consentGiven ? "Yes" : "No"}
                  </p>
                  <p>
                    ✓ Privacy Notice:{" "}
                    {client.privacyAcknowledged ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">
                Clinical Information
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-semibold">Presenting Concern:</span>{" "}
                  {client.presentingConcern}
                </p>
                <p>
                  <span className="font-semibold">Treatment Goals:</span>{" "}
                  {client.goals}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center space-x-2">
                <Pill size={20} />
                <span>Current Medications</span>
              </h3>
              <div className="space-y-2">
                {client.medications
                  .filter((m) => m.status === "Active")
                  .map((med) => (
                    <div key={med.id} className="p-3 bg-blue-50 rounded-lg">
                      <div className="font-semibold">{med.name}</div>
                      <div className="text-sm text-gray-600">
                        Prescribed:{" "}
                        {new Date(med.prescribedDate).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-lg flex items-center space-x-2">
                  <FileText size={20} />
                  <span>Appointment History</span>
                </h3>
                <button
                  onClick={() => setShowClientCalendar(!showClientCalendar)}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  {showClientCalendar ? "List View" : "Calendar View"}
                </button>
              </div>

              {showClientCalendar ? (
                <div className="border rounded-lg p-4">
                  <div className="text-center text-gray-600 py-8">
                    Client Calendar View - Shows appointment history in calendar
                    format
                  </div>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-auto">
                  {clientAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      onClick={() => setSelectedAppointment(apt)}
                      className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold">
                            {new Date(
                              `${apt.date}T${apt.time}`
                            ).toLocaleDateString()}{" "}
                            at {apt.time}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {apt.notes
                              ? apt.notes.substring(0, 100) +
                                (apt.notes.length > 100 ? "..." : "")
                              : "No notes"}
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            apt.status === "Confirmed"
                              ? "bg-green-100 text-green-800"
                              : apt.status === "Tentative"
                              ? "bg-yellow-100 text-yellow-800"
                              : apt.status === "Completed"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {apt.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AppointmentDetailModal = ({ appointment, onClose }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedNotes, setEditedNotes] = useState(appointment.notes);
    const [editedStatus, setEditedStatus] = useState(appointment.status);
    const client =
      appointment.type === "client"
        ? clients.find((c) => c.id === appointment.clientId)
        : null;

    const handleSave = () => {
      handleUpdateAppointment(appointment.id, {
        notes: editedNotes,
        status: editedStatus,
      });
      setIsEditing(false);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-2xl font-bold">Appointment Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">
                {appointment.type === "personal"
                  ? appointment.title
                  : client?.name}
              </h3>
              {client && (client.suicideRisk || client.selfHarmRisk) && (
                <div className="flex items-center space-x-2 text-red-600 mb-3">
                  <AlertCircle size={20} />
                  <span className="font-semibold">
                    Risk Factors: {client.suicideRisk && "Suicide"}{" "}
                    {client.suicideRisk && client.selfHarmRisk && "•"}{" "}
                    {client.selfHarmRisk && "Self-Harm"}
                  </span>
                </div>
              )}
              <p className="text-gray-600">
                {new Date(
                  `${appointment.date}T${appointment.time}`
                ).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                at {appointment.time}
              </p>
            </div>

            <div>
              <label className="block font-semibold mb-2">Status</label>
              <select
                value={editedStatus}
                onChange={(e) => setEditedStatus(e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Tentative">Tentative</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="No-show">No-show</option>
              </select>
            </div>

            {appointment.type === "client" && (
              <div>
                <label className="block font-semibold mb-2">
                  Session Notes
                </label>
                <textarea
                  value={editedNotes}
                  onChange={(e) => setEditedNotes(e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter session notes..."
                  rows={8}
                  className="w-full px-4 py-2 border rounded-lg resize-none"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Last updated: {new Date().toLocaleString()}
                </p>
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t">
              <button
                onClick={() => handleDeleteAppointment(appointment.id)}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Trash2 size={20} />
                <span>Delete</span>
              </button>

              <div className="flex space-x-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditedNotes(appointment.notes);
                        setEditedStatus(appointment.status);
                      }}
                      className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Save size={20} />
                      <span>Save</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Edit2 size={20} />
                    <span>Edit</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      {view === "dashboard" && <DashboardView />}
      {view === "clients" && <ClientsView />}
      {view === "settings" && <SettingsView />}

      {showAppointmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold">New Appointment</h2>
              <button
                onClick={() => setShowAppointmentModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block font-semibold mb-2">Type</label>
                <select
                  value={appointmentForm.type}
                  onChange={(e) =>
                    setAppointmentForm({
                      ...appointmentForm,
                      type: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="client">Client Appointment</option>
                  <option value="personal">Personal Block</option>
                </select>
              </div>

              {appointmentForm.type === "client" ? (
                <div>
                  <label className="block font-semibold mb-2">Client</label>
                  <select
                    value={appointmentForm.clientId}
                    onChange={(e) =>
                      setAppointmentForm({
                        ...appointmentForm,
                        clientId: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">Select a client</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block font-semibold mb-2">Title</label>
                  <input
                    type="text"
                    value={appointmentForm.title}
                    onChange={(e) =>
                      setAppointmentForm({
                        ...appointmentForm,
                        title: e.target.value,
                      })
                    }
                    placeholder="e.g., Lunch Break, Meeting"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold mb-2">Date</label>
                <input
                  type="date"
                  value={appointmentForm.date}
                  onChange={(e) =>
                    setAppointmentForm({
                      ...appointmentForm,
                      date: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Time</label>
                <input
                  type="time"
                  value={appointmentForm.time}
                  onChange={(e) =>
                    setAppointmentForm({
                      ...appointmentForm,
                      time: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Status</label>
                <select
                  value={appointmentForm.status}
                  onChange={(e) =>
                    setAppointmentForm({
                      ...appointmentForm,
                      status: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Tentative">Tentative</option>
                </select>
              </div>

              <button
                onClick={handleCreateAppointment}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                Create Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {showRecurringModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold">Recurring Appointment</h2>
              <button
                onClick={() => setShowRecurringModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block font-semibold mb-2">Client</label>
                <select
                  value={recurringForm.clientId}
                  onChange={(e) =>
                    setRecurringForm({
                      ...recurringForm,
                      clientId: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">Select a client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-2">Start Date</label>
                <input
                  type="date"
                  value={recurringForm.startDate}
                  onChange={(e) =>
                    setRecurringForm({
                      ...recurringForm,
                      startDate: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Time</label>
                <input
                  type="time"
                  value={recurringForm.time}
                  onChange={(e) =>
                    setRecurringForm({ ...recurringForm, time: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Frequency</label>
                <select
                  value={recurringForm.frequency}
                  onChange={(e) =>
                    setRecurringForm({
                      ...recurringForm,
                      frequency: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-2">
                  Number of Occurrences
                </label>
                <input
                  type="number"
                  min="1"
                  max="52"
                  value={recurringForm.occurrences}
                  onChange={(e) =>
                    setRecurringForm({
                      ...recurringForm,
                      occurrences: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  All recurring appointments will be created as{" "}
                  <strong>Tentative</strong> and require individual
                  confirmation.
                </p>
              </div>

              <button
                onClick={handleCreateRecurring}
                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
              >
                Create Recurring Appointments
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedClient && (
        <ClientDetailModal
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
        />
      )}

      {selectedAppointment && (
        <AppointmentDetailModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      )}
    </div>
  );
}

export default App;
