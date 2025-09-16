import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Activity, TreePine, Calendar } from "lucide-react";

const ActivityLogs = () => {
  const activities = [
    {
      id: 'A001',
      treeId: 'T001',
      type: 'individual',
      activity: 'รดน้ำต้นทุเรียน',
      notes: 'รดน้ำต้นทุเรียนรหัส T001 ปริมาณ 20 ลิตร',
      date: '2024-01-15',
      time: '08:30',
      brokerName: 'นายสมชาย ใจดี'
    },
    {
      id: 'A002',
      treeId: '-',
      type: 'overview',
      activity: 'ใส่ปุ่ยคอก',
      notes: 'ใส่ปุ่ยคอกให้ต้นทุเรียนทั้งหมดในแปลง A',
      date: '2024-01-14',
      time: '14:15',
      brokerName: 'นายสมชาย ใจดี'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link to="/owner-dashboard">
                <Button variant="ghost" size="sm" className="p-2">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-foreground">กิจกรรมผู้รับเหมา</h1>
                <p className="text-muted-foreground">ติดตามงานที่ผู้รับเหมาทำ</p>
              </div>
            </div>
            <div className="p-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full shadow-soft">
              <Activity className="h-8 w-8 text-white" />
            </div>
          </div>

          <div className="space-y-4">
            {activities.map((activity) => (
              <Card key={activity.id} className="shadow-card border-0 bg-card/80 backdrop-blur">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <TreePine className="h-5 w-5" />
                      {activity.treeId !== '-' ? `${activity.treeId} - ` : ''}{activity.activity}
                    </CardTitle>
                    <Badge className={activity.type === 'individual' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                      {activity.type === 'individual' ? 'รายต้น' : 'ภาพรวม'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-3">{activity.notes}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>ทำโดย: {activity.brokerName}</span>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{activity.date} {activity.time}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;