<?php

namespace App\Entity;

use App\Entity\Prestations;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\AppointmentsRepository;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=AppointmentsRepository::class)
 * @ApiResource(
 *  normalizationContext={"groups"={"read:appointments"}},
 *  itemOperations={
 *      "get"={},
 *      "put"={},
 *      "delete"={}
 *  },
 *  collectionOperations={
 *       "get"={},
 *       "post"={},
 *       "post_Appointments"={
 *          "method"="POST",
 *          "path"="/appointments/post",
 *          "controller"=App\Controller\Api\PostAppointments::class
 *       },
 *       "get_Appointments"={
 *          "method"="GET",
 *          "path"="/appointments/get/{id}",
 *          "controller"=App\Controller\Api\GetAppointments::class
 *       },
 *       "delete_Appointments"={
 *          "method"="DELETE",
 *          "path"="/appointments/delete/{id}",
 *          "controller"=App\Controller\Api\DeleteAppointments::class
 *       }
 *  }
 * )
 */
class Appointments
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"read:appointments", "read:users", "read:collaborateur"})
     */
    private $id;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"read:appointments", "read:users", "read:collaborateur"})
     */
    private $start;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"read:appointments", "read:users", "read:collaborateur"})
     */
    private $end;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"read:appointments", "read:users", "read:collaborateur"})
     */
    private $lastname;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"read:appointments", "read:users", "read:collaborateur"})
     */
    private $firstname;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"read:appointments", "read:users", "read:collaborateur"})
     */
    private $email;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"read:appointments", "read:users", "read:collaborateur"})
     */
    private $tel;

    /**
     * @ORM\ManyToOne(targetEntity=Prestations::class, inversedBy="appointement")
     * @Groups({"read:appointments", "read:users", "read:collaborateur"})
     */
    private $prestation;

    /**
     * @ORM\ManyToOne(targetEntity=Users::class, inversedBy="appointement")
     */
    private $users;

    /**
     * @ORM\ManyToOne(targetEntity=Users::class, inversedBy="rdv")
     * @Groups({"read:appointments"})
     */
    private $userTakeAppointments;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"read:appointments", "read:users", "read:collaborateur"})
     */
    private $note;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"read:appointments", "read:users","read:collaborateur"})
     */
    private $groupeId;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStart(): ?\DateTimeInterface
    {
        return $this->start;
    }

    public function setStart(\DateTimeInterface $start): self
    {
        $this->start = $start;

        return $this;
    }

    public function getEnd(): ?\DateTimeInterface
    {
        return $this->end;
    }

    public function setEnd(\DateTimeInterface $end): self
    {
        $this->end = $end;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): self
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): self
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getTel(): ?string
    {
        return $this->tel;
    }

    public function setTel(string $tel): self
    {
        $this->tel = $tel;

        return $this;
    }

    public function getPrestation(): ?Prestations
    {
        return $this->prestation;
    }

    public function setPrestation(?Prestations $prestation): self
    {
        $this->prestation = $prestation;

        return $this;
    }

    public function getUsers(): ?Users
    {
        return $this->users;
    }

    public function setUsers(?Users $users): self
    {
        $this->users = $users;

        return $this;
    }

    public function getNote(): ?string
    {
        return $this->note;
    }

    public function setNote(?string $note): self
    {
        $this->note = $note;

        return $this;
    }

    public function getGroupeId(): ?int
    {
        return $this->groupeId;
    }

    public function setGroupeId(?int $groupeId): self
    {
        $this->groupeId = $groupeId;

        return $this;
    }

    public function getUserTakeAppointments(): ?Users
    {
        return $this->userTakeAppointments;
    }

    public function setUserTakeAppointments(?Users $userTakeAppointments): self
    {
        $this->userTakeAppointments = $userTakeAppointments;

        return $this;
    }


   
}
