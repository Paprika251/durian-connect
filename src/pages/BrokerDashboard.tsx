import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Calculator, 
  PlusCircle, 
  AlertTriangle, 
  Activity,
  Sprout,
  CheckCircle,
  Clock
} from "lucide-react";

const BrokerDashboard = () => {
  // Mock data - replace with actual data from your backend
  const [isAccepted, setIsAccepted] = useState(true); // Change to false to see pending state

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/20">
      <div className="container mx-auto px-4 py-8">
        <div className="animate-fade-in">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-secondary rounded-full shadow-soft">
                <Sprout className="h-10 w-10 text-secondary-foreground" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              แผงควบคุมผู้รับเหมา
            </h1>
            <p className="text-muted-foreground">
              จัดการงานและบันทึกข้อมูลสวนทุเรียน
            </p>
          </div>

          {!isAccepted ? (
            /* Pending Approval State */
            <div className="max-w-2xl mx-auto">
              <Card className="shadow-soft border-0 bg-card/80 backdrop-blur text-center">
                <CardContent className="pt-8 pb-8">
                  <div className="flex justify-center mb-4">
                    <Clock className="h-16 w-16 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    รออนุมัติจากเจ้าของสวน
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    ใบสมัครของคุณอยู่ระหว่างการพิจารณา กรุณารอการติดต่อกลับ
                  </p>
                  <Link to="/submit-proposal">
                    <Button className="bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-soft">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      ยื่นข้อเสนอซื้อ
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Accepted State - Main Dashboard */
            <div className="max-w-6xl mx-auto">
              {/* Status Badge */}
              <div className="text-center mb-8">
                <Badge className="bg-gradient-success text-white px-4 py-2 text-sm shadow-soft">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  สถานะ: ได้รับการอนุมัติแล้ว
                </Badge>
              </div>

              {/* Menu Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Activity Recording */}
                <Link to="/record-activity">
                  <Card className="shadow-card border-0 bg-card/80 backdrop-blur hover:shadow-soft transition-smooth cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <div className="flex justify-center mb-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-soft group-hover:scale-105 transition-transform">
                          <Activity className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <CardTitle className="text-lg mb-2 text-foreground">
                        บันทึกกิจกรรม
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        บันทึกกิจกรรมที่ทำในสวน
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>

                {/* Fruit Count Recording */}
                <Link to="/record-fruit-count">
                  <Card className="shadow-card border-0 bg-card/80 backdrop-blur hover:shadow-soft transition-smooth cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <div className="flex justify-center mb-4">
                        <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-soft group-hover:scale-105 transition-transform">
                          <Sprout className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <CardTitle className="text-lg mb-2 text-foreground">
                        บันทึกจำนวนผล
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        บันทึกผลทุเรียนที่เก็บเกี่ยวได้
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>

                {/* Financial Recording */}
                <Link to="/record-finance">
                  <Card className="shadow-card border-0 bg-card/80 backdrop-blur hover:shadow-soft transition-smooth cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <div className="flex justify-center mb-4">
                        <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full shadow-soft group-hover:scale-105 transition-transform">
                          <Calculator className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <CardTitle className="text-lg mb-2 text-foreground">
                        บันทึกรายรับ-รายจ่าย
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        จัดการการเงินของสวน
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>

                {/* Problem Reporting */}
                <Link to="/report-problem">
                  <Card className="shadow-card border-0 bg-card/80 backdrop-blur hover:shadow-soft transition-smooth cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <div className="flex justify-center mb-4">
                        <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-soft group-hover:scale-105 transition-transform">
                          <AlertTriangle className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <CardTitle className="text-lg mb-2 text-foreground">
                        รายงานปัญหา
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        แจ้งปัญหาที่เกิดขึ้นในสวน
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrokerDashboard;