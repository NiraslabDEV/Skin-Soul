import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(appointments);
  } catch (e) {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const appt = await prisma.appointment.create({
      data: {
        serviceId: body.serviceId,
        serviceName: body.serviceName,
        price: Number(body.price),
        duration: String(body.duration),
        date: body.date,
        time: body.time,
        clientName: body.clientName,
        clientPhone: body.clientPhone,
        clientEmail: body.clientEmail || "",
        notes: body.notes || "",
        status: "pending",
      },
    });
    return NextResponse.json(appt, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
