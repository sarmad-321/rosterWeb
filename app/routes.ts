import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  // Auth routes
  route("auth/company-url", "routes/auth/company-url.tsx"),
  route("auth/login", "routes/auth/login.tsx"),

  // Protected routes with layout
  layout("routes/_app.tsx", [
    index("routes/home.tsx"),
    
    // Roster routes
    route("roster/view", "routes/roster/view.tsx"),
    route("roster/detail/:id", "routes/roster/detail.tsx"),
    route("roster/transactions", "routes/roster/transactions.tsx"),
    route("roster/schedule-timings", "routes/roster/schedule-timings.tsx"),
    route("roster/schedule-timings/:code", "routes/roster/schedule-timing-detail.tsx"),
    
    // Employee routes
    route("employees/list", "routes/employees/list.tsx"),
    route("employees/select", "routes/employees/select.tsx"),
    route("employees/:code/career", "routes/employees/career.tsx"),
    route("employees/:code/schedule", "routes/employees/schedule.tsx"),
    route("employees/:code/details", "routes/employees/detail.tsx"),
    
    // Shift routes
    route("shifts/definitions", "routes/shifts/definitions.tsx"),
    route("shifts/definitions/:code", "routes/shifts/definition-detail.tsx"),
    route("shifts/rules", "routes/shifts/rules.tsx"),
    route("shifts/rules/:code", "routes/shifts/rule-detail.tsx"),
    route("shifts/groupings", "routes/shifts/groupings.tsx"),
    route("shifts/groupings/:code", "routes/shifts/grouping-detail.tsx"),
    
    // Schedule routes
    route("schedules", "routes/schedules/list.tsx"),
    route("schedules/work-rules", "routes/schedules/work-rules.tsx"),
    route("schedules/work-rules/:code", "routes/schedules/work-rule-detail.tsx"),
    route("schedules/seasons", "routes/schedules/seasons.tsx"),
    route("schedules/seasons/:code", "routes/schedules/season-detail.tsx"),
    route("schedules/:code/shifts", "routes/schedules/shifts.tsx"),
    route("schedules/:code", "routes/schedules/detail.tsx"),
    
    // Settings and Profile
    route("settings", "routes/settings.tsx"),
    route("profile", "routes/profile.tsx"),
    route("reports", "routes/reports.tsx"),
  ]),
] satisfies RouteConfig;
